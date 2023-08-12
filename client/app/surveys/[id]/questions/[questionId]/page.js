"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import { returnQuestionJSX } from "@/app/utils/questions";
import { camelCaseToTitleCase } from "@/app/utils/helpers";

const EditQuestion = ({ params: { questionId } }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/surveys/${id}/questions/${questionId}`);
    },
  });

  const [question, setQuestion] = useState(null);

  const handleChange = (e) => {
    setQuestion((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChoiceChange = (idx, newValue) => {
    const newChoices = [...question.choices]; // Create a copy of the choices array
    newChoices[idx] = newValue; // Update the choice at the specified index
    setQuestion({ ...question, choices: newChoices }); // Update the state with the new choices array
  };

  const removeOption = (idx) => {
    const choicesCopy = question?.choices;
    choicesCopy.splice(idx, 1);
    setQuestion((prev) => ({ ...prev, choices: choicesCopy }));
  };

  const updateQuestion = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:5000/api/questions/${questionId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(question),
      }
    );

    await res.json();
    if (res.ok) {
      toast.success("Updated successfully");
    } else {
      toast.error("Couldn't update question. Please try later");
    }
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await fetch(
        `http://localhost:5000/api/questions/${questionId}`
      );
      const { data } = await res.json();
      console.log(data);
      setQuestion(data);
    };

    fetchQuestion();
  }, [questionId]);

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h2 className='text-3xl font-semibold my-4'>Edit Question </h2>

      <form
        className='p-6 my-4 mb-20 rounded-lg shadow-sm bg-white border border-gray-200'
        onSubmit={updateQuestion}
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
              htmlFor='type'
              className='text-sm text-gray-500 font-semibold mb-1'
            >
              Question type
            </label>
            <input
              type='text'
              disabled
              className='inline-block w-full p-2.5 border shadow-sm border-gray-300 rounded-lg  focus:shadow-md focus:outline-none focus:border-blue-600 text-gray-500 hover:cursor-not-allowed'
              value={camelCaseToTitleCase(question?.type)}
            />
          </div>
          <div className='my-2 flex flex-col w-full'>
            <label
              htmlFor='optional'
              className='text-sm text-gray-500 font-semibold mb-1'
            >
              Can this question be skipped
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
        <p className='text-sm text-gray-500'>
          <span className='text-lg text-red-700'>*</span> You cannot change the
          question type when editing, this is to keep the voting calculations
          accurate.
        </p>

        <div className='my-8'>
          <h4 className='font-semibold my-2'>Options</h4>
          <div>
            {question?.choices.map((choice, idx) => (
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

          <div className='my-8'>
            <h4 className='my-2'>Question preview</h4>
            <div className='bg-gray-50 border rounded-lg p-4'>
              <p className='font-semibold mb-2'>{question?.question}</p>
              {returnQuestionJSX(question?.type, question?.choices, true)}
            </div>
          </div>
        </div>

        <button
          type='submit'
          className='inline-block my-4 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow'
        >
          Save changes
        </button>
      </form>
    </div>
  );
};

export default EditQuestion;