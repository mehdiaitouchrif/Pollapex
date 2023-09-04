"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SkeletonBox from "../components/skeleton";
import { toast } from "react-hot-toast";
import Link from "next/link";

import { Lora } from "next/font/google";

const inter = Lora({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const SurveyResponsePage = () => {
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const { publicId } = useParams();

  // Handle the form
  const [answers, setAnswers] = useState([]);

  const handleInputChange = (questionId, answer) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const existingAnswerIndex = updatedAnswers.findIndex(
        (item) => item.question === questionId
      );

      if (existingAnswerIndex !== -1) {
        // Update the existing answer
        if (
          Array.isArray(updatedAnswers[existingAnswerIndex].answer) &&
          Array.isArray(answer)
        ) {
          // If incoming answer is in the array, remove it (user unchecked it)
          if (
            answer.every((item) =>
              updatedAnswers[existingAnswerIndex].answer.includes(item)
            )
          ) {
            updatedAnswers[existingAnswerIndex].answer = updatedAnswers[
              existingAnswerIndex
            ].answer.filter((i) => !answer.includes(i));
          } else {
            answer.forEach((item) => {
              if (!updatedAnswers[existingAnswerIndex].answer.includes(item)) {
                updatedAnswers[existingAnswerIndex].answer.push(item);
              }
            });
          }
        } else {
          // If one of them is not an array, replace the answer with the new value
          updatedAnswers[existingAnswerIndex].answer = answer;
        }
      } else {
        // Add a new answer
        updatedAnswers.push({ question: questionId, answer });
      }

      return updatedAnswers;
    });
  };

  // Render question JSX
  const renderQuestion = (question) => {
    const { _id, type, choices } = question;

    switch (type) {
      case "multipleChoice":
        return (
          <div key={_id} className='my-2'>
            <div className='flex flex-col'>
              {choices.map((choice) => (
                <label
                  key={choice}
                  className={`inline-flex items-center transition-all duration-300 mb-1 ${
                    answers
                      .find((item) => item.question === _id)
                      ?.answer.includes(choice)
                      ? "bg-blue-100 animate-selection"
                      : ""
                  }`}
                >
                  <input
                    type='checkbox'
                    className='form-checkbox text-blue-600 h-5 w-5'
                    onChange={(e) =>
                      handleInputChange(_id, [...(answers[_id] || []), choice])
                    }
                  />
                  <span className='ml-2'>{choice}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "singleChoice":
        return (
          <div key={_id} className='my-2'>
            <div className='flex flex-col'>
              {choices.map((choice) => (
                <label
                  key={choice}
                  className={`inline-flex items-center transition-all duration-300 mb-1 ${
                    answers.find((item) => item.question === _id)?.answer ===
                    choice
                      ? "bg-blue-100 animate-selection"
                      : ""
                  }`}
                >
                  <input
                    type='radio'
                    className='form-radio text-blue-600 h-5 w-5'
                    name={`question_${_id}`}
                    value={choice}
                    onChange={(e) => handleInputChange(_id, choice)}
                  />
                  <span className='ml-2'>{choice}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "date":
        return (
          <div key={_id} className='my-2'>
            <input
              type='date'
              className='mt-2 p-2 border rounded'
              onChange={(e) => handleInputChange(id, e.target.value)}
            />
          </div>
        );

      case "text":
        return (
          <div key={_id} className='my-2 relative z-0'>
            <input
              type='text'
              className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              name='text'
              id='text'
              placeholder=' '
              onChange={(e) => handleInputChange(id, e.target.value)}
            />
            <label
              htmlFor='text'
              className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              Short text
            </label>
          </div>
        );

      case "paragraph":
        return (
          <div key={_id} className='my-2 relative z-0'>
            <textarea
              className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              rows='4'
              id='paragraph'
              onChange={(e) => handleInputChange(_id, e.target.value)}
            ></textarea>
            <label
              htmlFor='paragraph'
              className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              Paragraph
            </label>
          </div>
        );

      case "email":
        return (
          <div key={_id} className='mb-4'>
            <input
              type='email'
              className='mt-2 p-2 border rounded w-full'
              onChange={(e) => handleInputChange(_id, e.target.value)}
            />
          </div>
        );

      case "rating":
        return (
          <div
            key={_id}
            className='mb-4 flex items-center justify-center md:justify-between'
          >
            <p className='pl-4 hidden md:block'>Negative</p>
            <div className='mt-2 flex items-center justify-center gap-3'>
              {[1, 2, 3, 4, 5].map((rating) => (
                <label
                  key={rating}
                  className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-2xl bg-gray-200 hover:bg-gray-300 ${
                    answers.find((item) => item.question == _id)?.answer ==
                    rating
                      ? "text-white bg-blue-500"
                      : ""
                  }`}
                >
                  <input
                    type='radio'
                    className='sr-only'
                    name={`question_${_id}`}
                    value={rating}
                    checked={
                      answers.find((item) => item.question === _id)?.answer ===
                      rating
                    }
                    onChange={(e) => handleInputChange(_id, rating)}
                  />
                  {rating}
                </label>
              ))}
            </div>
            <p className='pr-4 hidden md:block'>Positive</p>
          </div>
        );

      default:
        return null;
    }
  };

  // Submit response
  const handleSubmit = async (e) => {
    e.preventDefault();
    const surveyData = {
      answers,
    };

    // send to backend
    const res = await fetch(
      `http://localhost:5000/api/surveys/${publicId}/responses`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(surveyData),
      }
    );

    const { errors } = await res.json();
    if (!res.ok) {
      errors?.map((err) => toast.error(err.msg));
    } else {
      toast.success("Success!");
      setSuccess(true);
    }
  };

  useEffect(() => {
    setSuccess(false);
    const fetchSurvey = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/surveys/${publicId}`
        );
        if (!res.ok) {
          setError(data);
        }
        const { data } = await res.json();

        setSurvey(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    fetchSurvey();
  }, [publicId]);

  return (
    <div className='bg-orange-50 p-4 md:p-8 h-max min-h-screen'>
      <div className='max-w-3xl mx-auto mb-8'>
        {survey && survey.published && !success && (
          <>
            <div className='p-4 rounded-lg border border-gray-200 border-t-8 border-t-blue-400 shadow-sm'>
              <div>
                <h1 className='text-3xl font-semibold'>{survey.title}</h1>
                <p className='text-lg my-4'>{survey.description}</p>
              </div>
              <hr />
              <p className='my-2'>
                <span className='text-red-700'>*</span> Indicates required
                question
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {survey.questions.map((question, idx) => (
                <div
                  key={question._id}
                  className='bg-white py-3 rounded-lg shadow-sm border border-gray-200 my-4'
                >
                  <p className='font-semibold py-2 px-4'>
                    {idx + 1}. {question.question}{" "}
                    {!question.optional && (
                      <span className='text-red-700'>*</span>
                    )}
                  </p>
                  <div className='py-2 px-4 border-t border-gray-200 text-sm text-gray-600 font-normal'>
                    {renderQuestion(question)}
                  </div>
                </div>
              ))}
              {survey.questions?.length > 0 && (
                <button
                  type='submit'
                  className='inline-block py-2 px-6 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700'
                >
                  Submit
                </button>
              )}
            </form>
          </>
        )}

        {survey && success && (
          <div className='p-4 rounded-lg border border-gray-200 border-t-8 border-t-blue-400 shadow-sm'>
            <div>
              <h1 className='text-3xl font-semibold mb-2'>{survey.title}</h1>
              <hr />
              <p className='my-4'>Your response has been recorded!</p>
              <a
                className='text-blue-500 underline hover:text-blue-600'
                href={`/${publicId}`}
              >
                Send another response
              </a>
            </div>
          </div>
        )}

        {loading && (
          <>
            <SkeletonBox styleClasses='my-4' rowNumber={2} />
            <SkeletonBox styleClasses='my-4' rowNumber={3} />
            <SkeletonBox rowNumber={4} />
          </>
        )}

        {survey && !survey.published && (
          <div className='p-4 rounded-lg border border-gray-200 border-t-8 border-t-blue-400 shadow-sm'>
            <div>
              <h1 className='text-2xl font-semibold mb-2'>
                Survey does not exist or has been unpublished
              </h1>
              <hr />
              <Link
                className='inline-block mt-4 text-blue-500 underline hover:text-blue-600'
                href={`/`}
              >
                Back to the homepage
              </Link>
            </div>
          </div>
        )}

        <div className='my-8 text-center'>
          <hr className='mb-4' />
          <Link href='/'>
            <h1 className={`text-3xl font-semibold  ${inter.className}`}>
              Pollapex
            </h1>
          </Link>{" "}
        </div>
      </div>
    </div>
  );
};

export default SurveyResponsePage;
