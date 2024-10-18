import { useState } from "react";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { deleteQuestionHandler } from "@/utils/apiUtils/questions";
import { useSession } from "next-auth/react";
import { camelCaseToTitleCase } from "@/utils/helpers";

const QuestionsList = ({ questions: initialQuestions, surveyId }) => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const { data: session } = useSession();

  const deleteQuestion = async (questionId) => {
    setDeletingIds((prev) => new Set([...prev, questionId]));

    try {
      const isDeleted = await deleteQuestionHandler(
        questionId,
        session?.user?.token
      );

      if (isDeleted) {
        toast.success("Question deleted successfully");
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question._id !== questionId)
        );
      } else {
        toast.error("Failed to delete the question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete the question. Please try again later.");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No questions yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start building your survey by adding some questions.
        </p>
        <Link
          href={`/surveys/${surveyId}/add-question`}
          className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
        >
          Add your first question
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 my-4 rounded-lg bg-white shadow">
      {questions.map((question, idx) => (
        <div
          key={question._id}
          className={`flex items-center justify-between py-2 my-2 border-b ${
            idx === questions.length - 1
              ? "border-b-transparent"
              : "border-b-gray-100"
          }`}
        >
          <div className="mr-2">
            <h4 className="font-semibold text-gray-900">{question.question}</h4>
            <p className="text-gray-400 text-sm">
              {camelCaseToTitleCase(question.type)} |{" "}
              {question.required ? "Required" : "Optional"}{" "}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              className="rounded-lg shadow py-2 px-4 border border-gray-200 hover:bg-gray-50 duration-150 ease-in-out"
              href={`/surveys/${surveyId}/questions/${question._id}`}
            >
              Edit
            </Link>
            <button
              onClick={() => deleteQuestion(question._id)}
              disabled={deletingIds.has(question._id)}
              className={`inline-block rounded-lg shadow py-3 px-4 border ${
                deletingIds.has(question._id)
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-red-50 border-red-100 hover:bg-red-100"
              } duration-150 ease-in-out`}
            >
              <FaTrash
                size={18}
                className={`${
                  deletingIds.has(question._id)
                    ? "text-gray-400"
                    : "text-red-400"
                }`}
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionsList;
