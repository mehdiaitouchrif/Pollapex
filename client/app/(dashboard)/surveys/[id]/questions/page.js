"use client";
import { useSurveyData } from "@/utils/hooks/useSurveyData";
import { fetchSurveyData } from "@/utils/apiUtils/surveys";
import QuestionsList from "@/components/questionsList";
import Link from "next/link";

const QuestionsPage = ({ params: { id } }) => {
  const { data, loading, error } = useSurveyData(id, fetchSurveyData);

  if (loading)
    return (
      <div className="inset-0 mt-10 flex justify-center ">
        <div className="inset-0 opacity-50"></div>
        <div className="z-10 p-4 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      </div>
    );

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-600 mb-2">
          Error loading questions
        </h3>
        <p className="text-gray-500 mb-4">
          {error.message || "Please try again later"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      <QuestionsList questions={data?.questions || []} surveyId={id} />
      {data?.questions?.length > 0 && (
        <Link
          className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg my-6"
          href={`/surveys/${id}/add-question`}
        >
          Add a new question
        </Link>
      )}
    </div>
  );
};

export default QuestionsPage;
