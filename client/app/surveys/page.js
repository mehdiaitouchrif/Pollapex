"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import SurveyBox from "../components/surveyBox";
import CreateSurveyBox from "../components/createSurveyBox";
import SkeletonBox from "../components/skeleton";
import { fetchSurveys } from "../utils/apiUtils/surveys";

const Surveys = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/surveys");
    },
  });

  const [surveys, setSurveys] = useState(null);
  const [surveysLoading, setSurveysLoading] = useState(true);

  useEffect(() => {
    const user = session?.user;
    if (user?.token) {
      fetchSurveys(user.token)
        .then((data) => {
          setSurveys(data);
          setSurveysLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching surveys: ", error);
          setSurveysLoading(false);
        });
    }
  }, [session]);

  return (
    <div className='max-w-6xl mx-auto py-4 px-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-2 order-2 md:order-1'>
          <h2 className='text-3xl font-semibold my-4'>Surveys</h2>
          {/* Loading */}
          {surveysLoading && <SkeletonBox />}

          {/* Surveys */}
          {surveys && surveys.length > 0 && (
            <div className='p-4 my-4 rounded-lg bg-white shadow'>
              {surveys.map((survey, idx) => (
                <SurveyBox
                  key={survey._id}
                  makeBorderTransparent={idx === surveys?.length - 1}
                  survey={survey}
                />
              ))}
            </div>
          )}
        </div>

        <CreateSurveyBox />
      </div>
    </div>
  );
};

export default Surveys;
