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
import { fetchStatistics, fetchSurveys } from "../utils/apiUtils/surveys";
import { fetchResponses } from "../utils/apiUtils/responses";
import { IoMdClose } from "react-icons/io";

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

  const [statistics, setStatistics] = useState(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const user = session?.user;

    if (user?.token) {
      fetchSurveys(user.token, 3)
        .then((data) => {
          setSurveys(data);
          setSurveysLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching surveys: ", error);
          setSurveysLoading(false);
        });

      // Fetch recent responses
      fetchResponses(user.token, 3)
        .then((data) => {
          setResponses(data);
          setResponsesLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching responses: ", error);
          setResponsesLoading(false);
        });

      // Fetch statistics
      fetchStatistics(user.token)
        .then((data) => {
          setStatistics(data);
          setStatisticsLoading(false);
        })
        .catch((error) => {
          setStatisticsLoading(false);
          console.log(error);
        });
    }
  }, [session]);

  useEffect(() => {
    if (
      surveys &&
      surveys.length === 1 &&
      surveys[0].title.trim() === "Default Example Survey"
    ) {
      setShowMessage(true);
    }
  }, [surveys]);

  return (
    <div className='max-w-6xl mx-auto py-4 px-3 md:px-6'>
      {showMessage && (
        <div className='p-4 bg-blue-500 text-white font-medium flex items-start justify-between rounded-lg shadow mb-4'>
          <div>
            <h4 className='text-xl mb-2'>Welcome to Pollapex</h4>
            <p className='text-sm'>
              We created a default survey for you as an example of what you can
              accomplish. Please feel free to create your own surveys or modify
              anything as you wish.
            </p>
          </div>

          <div>
            <IoMdClose
              className='text-xl cursor-pointer hover:text-gray-100'
              onClick={() => setShowMessage(false)}
            />
          </div>
        </div>
      )}
      <h2 className='text-2xl md:text-3xl font-semibold my-4'>Dashboard</h2>

      {statisticsLoading ? (
        <div className='grid grid-cols-1 gap-y-4 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <SkeletonBox rowNumber={2} hideFull={true} />
          <SkeletonBox rowNumber={2} hideFull={true} />
          <SkeletonBox rowNumber={2} hideFull={true} />
        </div>
      ) : (
        statistics && (
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-4 md:mb-8'>
            <>
              <div className='bg-white rounded-lg shadow border p-4 '>
                <p className='text-sm text-gray-400 font-medium'>
                  Surveys created
                </p>
                <h4 className='text-2xl md:text-3xl my-2 font-semibold'>
                  {statistics.totalSurveys}{" "}
                </h4>
              </div>
              <div className='bg-white rounded-lg shadow border p-4'>
                <p className='text-sm text-gray-400 font-medium'>
                  Total responses
                </p>
                <h4 className='text-2xl md:text-3xl my-2 font-semibold'>
                  {statistics.totalResponses}
                </h4>
              </div>
              <div className='bg-white rounded-lg shadow border p-4'>
                <p className='text-sm text-gray-400 font-medium'>
                  Average responses per survey
                </p>

                <h4 className='text-2xl md:text-3xl my-2 font-semibold'>
                  {statistics.averageResponsesPerSurvey.toFixed(2)}{" "}
                </h4>
              </div>
              <div className='bg-white rounded-lg shadow border p-4'>
                <p className='text-sm text-gray-400 font-medium'>
                  Average response time{" "}
                </p>
                <h4 className='text-2xl md:text-3xl my-2 font-semibold'>
                  {statistics.averageResponseTime}{" "}
                </h4>
              </div>
            </>
          </div>
        )
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-2 order-2 md:order-1'>
          <h2 className='text-2xl font-semibold my-4'>Recent surveys</h2>

          {/* Loading */}
          {surveysLoading && (
            <div className='flex flex-col gap-y-2'>
              <SkeletonBox />
              <SkeletonBox />
            </div>
          )}

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
          {responsesLoading && (
            <>
              <SkeletonBox styleClasses='my-2' />
              <SkeletonBox styleClasses='my-2' />
            </>
          )}

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
