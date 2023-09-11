"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SkeletonBox from "@/components/skeleton";
import { toast } from "react-hot-toast";
import Link from "next/link";

import SurveyForm from "@/components/surveyForm";
import {
  fetchSurveyData,
  submitSurveyResponse,
} from "@/utils/apiUtils/surveys";

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

  // Submit response
  const handleSubmit = async (e) => {
    e.preventDefault();
    const surveyData = {
      answers,
    };

    // send to backend
    submitSurveyResponse(publicId, surveyData)
      .then((data) => {
        setSuccess(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.message);
      });
  };

  useEffect(() => {
    setSuccess(false);

    fetchSurveyData(publicId)
      .then((data) => {
        setSurvey(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [publicId]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "name x",
    title: "title x",
    description: "description x",
  };

  return (
    <div className=' p-4 md:p-8 h-max'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

            <SurveyForm
              survey={survey}
              answers={answers}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
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
      </div>
    </div>
  );
};

export default SurveyResponsePage;
