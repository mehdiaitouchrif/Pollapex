"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import GoBackLink from "@/app/components/GoBackLink";
import { addQuestionHandler } from "@/app/utils/apiUtils/questions";

const AddQuestion = ({ params: { id } }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/surveys/${id}/add-question`);
    },
  });

  //   Question form
  const [question, setQuestion] = useState({
    question: "",
    type: "multipleChoice",
    optional: false,
    choices: [],
  });

  const handleChange = (e) => {
    setQuestion((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChoiceChange = (idx, newValue) => {
    const newChoices = [...question.choices];
    newChoices[idx] = newValue;
    setQuestion((prev) => ({ ...prev, choices: newChoices }));
  };

  const removeOption = (idx) => {
    const choicesCopy = [...question?.choices];
    choicesCopy.splice(idx, 1);
    setQuestion((prev) => ({ ...prev, choices: choicesCopy }));
  };

  const addQuestion = async (e) => {
    e.preventDefault();

    try {
      const isAdded = await addQuestionHandler(
        question,
        id,
        session?.user?.token
      );

      if (isAdded) {
        toast.success("Question added successfully");
        setQuestion({
          question: "",
          type: "multipleChoice",
          optional: false,
          choices: [],
        });
      } else {
        toast.error("Couldn't add question. Please try again later");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      toast.error("Failed to add the question. Please try again later.");
    }
  };

  const hideChoices = () => {
    const acceptChoices = ["multipleChoice", "singleChoice"];
    if (acceptChoices.includes(question?.type)) {
      return;
    }
    return "hidden";
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <GoBackLink />
      <h2 className='text-3xl font-semibold my-4'>Add Question </h2>

      <form
        className='p-6 my-4 mb-20 rounded-lg shadow-sm bg-white border border-gray-200'
        onSubmit={addQuestion}
      >
        <div className='my-2 flex flex-col'>
          <label
            htmlFor='question'
            className='text-sm text-gray-500 font-semibold mb-1'
          >
            Question
          </label>
          <input
            type='text'
            className='inline-block w-full p-2.5 border shadow-sm border-gray-300 rounded-lg  focus:shadow-md focus:outline-none focus:border-blue-600'
            value={question?.question}
            name='question'
            onChange={handleChange}
          />
        </div>

        <div className='flex items-center justify-between gap-8'>
          <div className='my-2 flex flex-col w-full'>
            <label
              htmlFor='optional'
              className='text-sm text-gray-500 font-semibold mb-1'
            >
              Question type
            </label>
            <select
              type='text'
              className='inline-block bg-white w-full p-2.5 border shadow-sm border-gray-300 rounded-lg  focus:shadow-md focus:outline-none focus:border-blue-600'
              value={question?.type}
              name='type'
              onChange={handleChange}
            >
              <option value='multipleChoice'>Multiple Choice</option>
              <option value='singleChoice'>Single Choice</option>
              <option value='paragraph'>Paragraph</option>
              <option value='text'>Short text</option>
              <option value='rating'>Rating</option>
              <option value='time'>Time</option>
              <option value='date'>Date</option>
              <option value='email'>Email</option>
              <option value='phone'>Phone</option>
            </select>
          </div>
          <div className='my-2 flex flex-col w-full'>
            <label
              htmlFor='optional'
              className='text-sm text-gray-500 font-semibold mb-1'
            >
              Can this question be skipped?
            </label>
            <select
              type='text'
              className='inline-block bg-white w-full p-2.5 border shadow-sm border-gray-300 rounded-lg  focus:shadow-md focus:outline-none focus:border-blue-600'
              value={question?.optional}
              name='optional'
              onChange={handleChange}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
        </div>

        <div className={`my-8 ${hideChoices()}`}>
          <h4 className='font-semibold my-2'>Options</h4>
          <div>
            {question?.choices?.map((choice, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between gap-4 my-3'
              >
                <input
                  type='text'
                  className='inline-block w-full p-2.5 border shadow-sm border-gray-300 rounded-lg  focus:shadow-md focus:outline-none focus:border-blue-600'
                  value={choice}
                  onChange={(e) => handleChoiceChange(idx, e.target.value)}
                />
                <div
                  onClick={() => removeOption(idx)}
                  className='h-7 w-7 text-gray-400 font-semibold shadow flex items-center justify-center rounded-full border border-gray-500 hover:text-gray-500 hover:shadow-lg hover:cursor-pointer '
                >
                  X
                </div>
              </div>
            ))}
          </div>
          <button
            type='button'
            className='inline-block my-4 py-2 px-4 border border-gray-200 bg-gray-50 rounded-lg shadow-sm'
            onClick={() =>
              handleChoiceChange(
                question?.choices.length,
                `Option ${question?.choices.length + 1}`
              )
            }
          >
            Add another option
          </button>
        </div>

        <button
          type='submit'
          className='inline-block my-4 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow'
        >
          Add Question
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
