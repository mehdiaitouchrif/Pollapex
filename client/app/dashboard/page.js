"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import SurveyBox from "../components/surveyBox";
import CreateSurveyBox from "../components/createSurveyBox";
import { BsBoxArrowUpRight } from "react-icons/bs";
import SkeletonBox from "../components/skeleton";
import { timeAgo } from "../utils/helpers";

const Dashboard = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/dashboard");
    },
  });

  const [surveys, setSurveys] = useState(null);
  const [surveysLoading, setSurveysLoading] = useState(true);
  const [responses, setResponses] = useState(null);
  const [responsesLoading, setResponsesLoading] = useState(true);

  useEffect(() => {
    const user = session?.user;
    const fetchSurveys = async () => {
      const res = await fetch("http://localhost:5000/api/surveys?limit=3", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const { data } = await res.json();
      setSurveys(data);
      setSurveysLoading(false);
    };

    const fetchRecentResponses = async () => {
      const res = await fetch("http://localhost:5000/api/responses?limit=3", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const { data } = await res.json();
      setResponses(data);
      setResponsesLoading(false);
    };

    fetchSurveys();
    fetchRecentResponses();
  }, [session]);

  return (
    <div className='max-w-6xl mx-auto py-4 px-6'>
      <h2 className='text-3xl font-semibold my-4'>Dashboard</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-2 order-2 md:order-1'>
          <h2 className='text-2xl font-semibold my-4'>Recent surveys</h2>

          {/* Loading */}
          {surveysLoading && <SkeletonBox />}

          {/* Surveys */}
          {surveys && (
            <>
              {surveys.length > 0 && (
                <>
                  <div className='p-4 my-4 rounded-lg bg-white shadow'>
                    {surveys.map((survey, idx) => (
                      <SurveyBox
                        key={survey._id}
                        makeBorderTransparent={idx === surveys?.length - 1}
                        survey={survey}
                      />
                    ))}
                  </div>
                  <Link
                    href='/surveys'
                    className='text-blue-600 hover:text-blue-500 font-semibold text-sm flex items-center gap-2 mb-8'
                  >
                    <p>See all surveys</p>
                    <BsBoxArrowUpRight size={16} color='blue' />
                  </Link>
                </>
              )}

              {surveys.length === 0 && (
                <h3 className='text-2xl text-gray-500 my-4'>
                  Nothing here yet!
                </h3>
              )}
            </>
          )}

          <h2 className='text-2xl font-semibold my-4'>Recent responses</h2>

          {/* Loading */}
          {responsesLoading && <SkeletonBox />}

          {/* Responses */}
          {responses && (
            <>
              {responses.length > 0 && (
                <div className='px-4 py-2 my-4 rounded-lg bg-white shadow'>
                  {" "}
                  {responses.map((response, idx) => (
                    <div
                      key={response._id}
                      className={`flex items-center justify-between py-2 my-2 border-b ${
                        idx === responses.length - 1
                          ? "border-b-transparent"
                          : "border-b-gray-100"
                      }`}
                    >
                      <div className='mr-2'>
                        <h4 className='font-semibold'>
                          Response #{idx + 1} on {response.survey?.title}
                        </h4>
                        <p className='mb-2 text-sm text-gray-400'>
                          Completed {timeAgo(response.submittedAt)}
                        </p>
                      </div>

                      <Link
                        className='rounded-lg shodow py-2 px-4 border border-gray-200 hover:bg-gray-50 duration-150 ease-in-out'
                        href={`/responses/${response._id}`}
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {responses.length === 0 && (
                <h3 className='text-2xl text-gray-500 my-4'>
                  Nothing here yet!
                </h3>
              )}
            </>
          )}

          {responses && responses.length > 0 && (
            <Link
              href='/responses'
              className='text-blue-600 hover:text-blue-500 font-semibold text-sm flex items-center gap-2 mb-8'
            >
              <p>See all responses</p>
              <BsBoxArrowUpRight size={16} color='blue' />
            </Link>
          )}
        </div>

        <CreateSurveyBox />
      </div>
    </div>
  );
};

export default Dashboard;
