"use client";
import Question from "@/app/components/question";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { createSurvey } from "@/app/utils/apiUtils/surveys";

const CreateSurveyPage = () => {
  // Auth
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/surveys/${id}/questions/${questionId}`);
    },
  });

  // Survey state
  const [survey, setSurvey] = useState({
    title: "",
    description: "",
    questions: [
      {
        question: "Default exemplar question",
        type: "multipleChoice",
        optional: false,
        choices: ["Option 1", "Option 2"],
      },
    ],
  });

  // Handle survey form
  const handleChange = (e) => {
    setSurvey((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addQuestion = () => {
    const newQuestion = {
      question: "",
      type: "multipleChoice",
      optional: false,
      choices: [],
    };
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      questions: [...prevSurvey.questions, newQuestion],
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setSurvey((prevSurvey) => {
      const updatedQuestions = [...prevSurvey.questions];
      updatedQuestions[index][field] = value;
      return { ...prevSurvey, questions: updatedQuestions };
    });
  };

  const duplicateQuestion = (index) => {
    setSurvey((prevSurvey) => {
      const questionToDuplicate = { ...prevSurvey.questions[index] };
      const updatedQuestions = [...prevSurvey.questions];
      updatedQuestions.splice(index + 1, 0, questionToDuplicate);
      return { ...prevSurvey, questions: updatedQuestions };
    });
  };

  const deleteQuestion = (index) => {
    setSurvey((prevSurvey) => {
      const updatedQuestions = prevSurvey.questions.filter(
        (_, i) => i !== index
      );
      return { ...prevSurvey, questions: updatedQuestions };
    });
  };

  // Manage question choices (consumed in questionTypeRenderer / question)
  const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    setSurvey((prevSurvey) => {
      const updatedQuestions = [...prevSurvey.questions];
      updatedQuestions[questionIndex].choices[choiceIndex] = value;
      return { ...prevSurvey, questions: updatedQuestions };
    });
  };

  const addChoice = (questionIndex) => {
    setSurvey((prevSurvey) => {
      const updatedQuestions = [...prevSurvey.questions];
      updatedQuestions[questionIndex].choices.push(
        `Option ${updatedQuestions[questionIndex].choices.length + 1}`
      );
      return { ...prevSurvey, questions: updatedQuestions };
    });
  };

  const deleteChoice = (questionIndex, choiceIndex) => {
    setSurvey((prevSurvey) => {
      const updatedQuestions = [...prevSurvey.questions];
      updatedQuestions[questionIndex].choices.splice(choiceIndex, 1);
      return { ...prevSurvey, questions: updatedQuestions };
    });
  };

  // Create the survey (finally)
  const publishSurveyHandler = async () => {
    try {
      const isPublished = await createSurvey(survey, session?.user?.token);

      if (isPublished) {
        toast.success("Survey created successfully");
      } else {
        toast.error("Couldn't create the survey. Please try again later");
      }
    } catch (error) {
      console.error("Error publishing survey:", error);
      toast.error("Failed to create the survey. Please try again later.");
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-3 md:p-4'>
      {/* survey initials */}
      <div className='bg-white p-4 rounded-lg shadow my-8 border-t-4 md:border-t-8 border-t-blue-500 border-l-8 focus:border-l-purple-500'>
        <div className='relative z-0 w-full mb-6 group'>
          <input
            type='text'
            name='title'
            id='title'
            value={survey.title}
            onChange={handleChange}
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
          />
          <label
            htmlFor='title'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Title
          </label>
        </div>

        <div className='relative z-0 w-full mb-6 group'>
          <textarea
            type='text'
            name='description'
            id='description'
            value={survey.description}
            onChange={handleChange}
            rows={4}
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
          />
          <label
            htmlFor='description'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Description
          </label>
        </div>
      </div>

      {/* questions */}
      {survey.questions.map((question, index) => (
        <Question
          key={index}
          question={question}
          index={index}
          handleQuestionChange={handleQuestionChange}
          duplicateQuestion={duplicateQuestion}
          deleteQuestion={deleteQuestion}
          handleChoiceChange={handleChoiceChange}
          addChoice={addChoice}
          deleteChoice={deleteChoice}
        />
      ))}

      <button
        style={{ top: "25%", right: "15%" }}
        className='inline-block fixed bg-white p-4 rounded-full shadow-lg border-2 border-transparent hover:border-2 hover:border-blue-500 focus:bg-none focus:outline-none'
        onClick={addQuestion}
      >
        <FaPlus size={24} className='text-gray-600' />
      </button>

      <button
        onClick={publishSurveyHandler}
        className='inline-block mt-4 mb-10 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg'
      >
        Create Survey
      </button>
    </div>
  );
};

export default CreateSurveyPage;
