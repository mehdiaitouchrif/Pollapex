import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import SurveyOverview from "@/components/surveyOverview";
import { camelCaseToTitleCase } from "@/utils/helpers";
import { fetchSurveyAnalytics } from "@/utils/apiUtils/surveys";

const SurveyPage = async ({ params: { id } }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/login?callbackUrl=/surveys/${id}`);
  }

  const analytics = await fetchSurveyAnalytics(session.user.token, id);

  return (
    <div>
      <SurveyOverview id={id} />
      <div className='bg-gray-50'>
        <div className='max-w-6xl mx-auto p-3 my-8 md:p-8'>
          <div className='flex items-center gap-8'>
            <Link
              href={`/surveys/${id}`}
              className='inline-block font-semibold text-lg hover:text-black'
            >
              Overview
            </Link>
            <Link
              href={`/surveys/${id}/responses`}
              className='inline-block text-gray-600 text-lg hover:text-black'
            >
              Responses
            </Link>
            <Link
              href={`/surveys/${id}/questions`}
              className='inline-block text-gray-600 text-lg hover:text-black'
            >
              Questions
            </Link>

            <Link
              href={`/surveys/${id}/collaborators`}
              className='inline-block text-gray-600 text-lg hover:text-black'
            >
              Collaborators
            </Link>
          </div>

          <div className='my-4 rounded-2xl shadow bg-white'>
            {Object.values(analytics).map((item, idx) => (
              <div key={item.question} className='p-4 mb-4 shadow rounded-2xl'>
                <div className='mb-4'>
                  <p className='font-semibold text-lg'>
                    {idx + 1}. {item.question}
                  </p>
                  <p className='text-gray-500 text-sm mb-1'>
                    Total respondants: {item.totalCount}
                  </p>
                  <p className='text-gray-500 text-sm'>
                    Type: {camelCaseToTitleCase(item.type)}{" "}
                  </p>
                </div>
                <div>
                  {Object.keys(item.data).map((keyItem) => (
                    <div key={keyItem}>
                      <div className='flex items-center justify-between font-bold'>
                        <p className='mb-4 font-normal'>{keyItem}</p>
                        <p>
                          {Math.fround(item.data[keyItem].percentage).toFixed(
                            2
                          )}
                          %
                        </p>
                      </div>
                      <div className='w-full'>
                        <div className='h-1.5 relative bg-gray-200 mb-4 rounded-lg'>
                          <span
                            className='inline-block h-full absolute text-blue-400 bg-blue-500'
                            style={{
                              width: `${item.data[keyItem].percentage}%`,
                            }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
