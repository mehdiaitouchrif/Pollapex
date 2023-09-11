"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import { camelCaseToTitleCase } from "@/utils/helpers";
import GoBackLink from "@/components/GoBackLink";
import {
  fetchSingleQuestion,
  updateQuestionHandler,
} from "@/utils/apiUtils/questions";
import { AiOutlineCloseCircle } from "react-icons/ai";

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
    const newChoices = [...question.choices];
    newChoices[idx] = newValue;
    setQuestion((prev) => ({ ...prev, choices: newChoices }));
  };

  const removeOption = (idx) => {
    const choicesCopy = [...question?.choices];
    choicesCopy.splice(idx, 1);
    setQuestion((prev) => ({ ...prev, choices: choicesCopy }));
  };

  const updateQuestion = async (e) => {
    e.preventDefault();

    try {
      const isUpdated = await updateQuestionHandler(
        questionId,
        session?.user?.token,
        question
      );

      if (isUpdated) {
        toast.success("Updated successfully");
      } else {
        toast.error("Couldn't update question. Please try later");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("Failed to update the question. Please try again later.");
    }
  };

  const hideChoices = () => {
    const acceptChoices = ["multipleChoice", "singleChoice"];
    if (acceptChoices.includes(question?.type)) {
      return;
    }
    return "hidden";
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionData = await fetchSingleQuestion(questionId);
        setQuestion(questionData);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion();
  }, [questionId]);

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <GoBackLink />
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

        <div className='flex items-center justify-between flex-col md:flex-row md:gap-8'>
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
        <p className='text-sm text-gray-500'>
          <span className='text-lg text-red-700'>*</span> You cannot change the
          question type when editing, this is to keep the voting calculations
          accurate.
        </p>

        <div className={`my-8 ${hideChoices()}`}>
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
                <AiOutlineCloseCircle
                  size={24}
                  className='cursor-pointer hover:text-red-700'
                  onClick={() => removeOption(idx)}
                />
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
          Save changes
        </button>
      </form>
    </div>
  );
};

export default EditQuestion;
