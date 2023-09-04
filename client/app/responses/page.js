"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import CreateSurveyBox from "../components/createSurveyBox";
import SkeletonBox from "../components/skeleton";
import Link from "next/link";
import { fetchResponses } from "../utils/apiUtils/responses";

const Responses = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/responses");
    },
  });

  const [responses, setResponses] = useState(null);
  const [responsesLoading, setResponsesLoading] = useState(true);

  useEffect(() => {
    const user = session?.user;

    fetchResponses(user?.token)
      .then((data) => {
        setResponses(data);
        setResponsesLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching responses: ", error);
        setResponsesLoading(false);
      });
  }, [session]);

  return (
    <div className='max-w-6xl mx-auto py-4 px-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-2 order-2 md:order-1'>
          <h2 className='text-3xl font-semibold my-4'>Responses</h2>
          {/* Loading */}
          {responsesLoading && <SkeletonBox />}

          {/* Responses */}
          {responses && responses.length > 0 && (
            <div className='p-4 my-4 rounded-lg bg-white shadow'>
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
                      Completed on{" "}
                      {new Date(response.submittedAt).toLocaleString()}{" "}
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
        </div>

        <CreateSurveyBox />
      </div>
    </div>
  );
};

export default Responses;
