"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import SurveyOverview from "@/app/components/surveyOverview";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";

const QuestionsPage = ({ params: { id } }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/surveys/${id}`);
    },
  });
  const [questions, setQuestions] = useState([]);

  // Delete question
  const deleteQuestion = async (questionId) => {
    console.log(session?.user?.token);
    try {
      const response = await fetch(
        `http://localhost:5000/api/questions/${questionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question._id !== questionId)
        );

        toast.success("Deleted!");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete the question. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchSurveyQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/surveys/${id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
              "content-type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch questions data.");
        }

        const { data } = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error(error);
      }
    };

    if (session && id) {
      fetchSurveyQuestions();
    }
  }, [session, id]);

  return (
    <>
      <SurveyOverview id={id} />

      <div className='bg-gray-50'>
        <div className='max-w-6xl mx-auto p-4 my-8 md:p-8'>
          <div className='flex items-center gap-8'>
            <Link
              href={`/surveys/${id}`}
              className='inline-block text-gray-600 text-lg'
            >
              Overview
            </Link>
            <Link
              href={`/surveys/${id}/responses`}
              className='inline-block text-gray-600 text-lg'
            >
              Responses
            </Link>
            <Link
              href={`/surveys/${id}/questions`}
              className='inline-block font-semibold text-lg'
            >
              Questions
            </Link>
          </div>

          {questions.length > 0 && (
            <div className='px-4 py-2 my-4 rounded-lg bg-white shadow'>
              {questions.map((question, idx) => (
                <div
                  key={question._id}
                  className={`flex items-center justify-between py-2 my-2 border-b ${
                    idx === questions.length - 1
                      ? "border-b-transparent"
                      : "border-b-gray-100"
                  }`}
                >
                  <div className='mr-2'>
                    <h4 className='font-semibold text-gray-900'>
                      {question.question}
                    </h4>
                    <p className='text-gray-400 text-sm'>
                      {question.type} |{" "}
                      {question.required ? "Required" : "Optional"}{" "}
                    </p>
                  </div>

                  <div className='flex items-center gap-4'>
                    <Link
                      className='rounded-lg shodow py-2 px-4 border border-gray-200 hover:bg-gray-50 duration-150 ease-in-out'
                      href={`/surveys/${id}/edit-question/${question._id}`}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteQuestion(question._id)}
                      className='inline-block rounded-lg shodow py-3 px-4 border bg-red-50 border-red-100 shadow hover:bg-red-100 duration-150 ease-in-out'
                      href={`/surveys/${id}/edit-question/${question._id}`}
                    >
                      <FaTrash size={18} className='text-red-400' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionsPage;
