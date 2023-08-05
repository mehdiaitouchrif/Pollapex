"use client";
import { useState, useEffect } from "react";
import { MdContentCopy } from "react-icons/md";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import SkeletonBox from "./skeleton";
import toast from "react-hot-toast";

const SurveyOverview = ({ id }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/surveys/${id}`);
    },
  });
  const [survey, setSurvey] = useState({});
  const [loading, setLoading] = useState(true);

  // Survey Public Link
  const [isCopied, setIsCopied] = useState(false);
  const dynamicUrl = `${window.location.origin}/surveys/fill/${id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dynamicUrl);
      setIsCopied(true);
      toast.success("Copied!");
    } catch (error) {
      console.error("Failed to copy URL to clipboard:", error);
    }
  };

  // Publish survey
  const publishOrDisableSurvey = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/surveys/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          active: survey.active ? "false" : "true",
          published: survey.published ? "false" : "true",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update survey.");
      }

      const { survey: data } = await response.json();
      setSurvey(data);
    } catch (error) {
      console.error("Error updating survey:", error);
      toast.error("Failed to update the survey. Please try again later.");
    }
  };

  // API requests
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/surveys/${id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch survey data.");
        }

        const { data: survey } = await response.json();
        setSurvey(survey);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (session && id) {
      fetchSurvey();
    }
  }, [session, id]);

  return (
    <div className='bg-white border-t shadow'>
      <div className='max-w-6xl mx-auto p-4 md:p-8 my-6'>
        {loading ? (
          <SkeletonBox />
        ) : (
          <>
            {survey.active ? (
              <div className='p-2 text-sm w-fit rounded-lg bg-green-200 text-green-600'>
                Active
              </div>
            ) : (
              <div className='p-2 text-sm w-fit rounded-lg bg-red-100 text-red-500'>
                Inactive
              </div>
            )}

            <h2 className='text-3xl mt-4 font-semibold'>{survey.title}</h2>
            <p className='leading-10 text-gray-600'>{survey.description}</p>

            <div className='flex  items-center gap-8'>
              {survey.active ? (
                <button
                  onClick={publishOrDisableSurvey}
                  className='inline-block py-2 px-4 bg-red-100 text-red-500 rounded-lg my-4'
                >
                  Disable survey
                </button>
              ) : (
                <button
                  onClick={publishOrDisableSurvey}
                  className='inline-block py-2 px-4 bg-blue-500 text-white font-bold rounded-lg my-4'
                >
                  Publish Survey
                </button>
              )}

              {survey.active && (
                <div
                  className='flex items-center border py-2 px-4 rounded bg-gray-50 item'
                  onClick={handleCopy}
                  disabled={isCopied}
                >
                  <Link href={`/surveys/fill/${id}`}>{dynamicUrl}</Link>
                  <MdContentCopy
                    className='ml-4 text-green-600 cursor-pointer hover:text-gray-500'
                    size={20}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SurveyOverview;
