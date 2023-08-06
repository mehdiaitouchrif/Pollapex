import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {
  FaUser,
  FaChrome,
  FaFirefoxBrowser,
  FaSafari,
  FaEdge,
  FaCheck,
} from "react-icons/fa";
import {
  capitalizeString,
  getBrowserName,
  timeAgo,
  trimIdToSixChars,
} from "@/app/utils/helpers";

const SingleResponse = async ({ params: { id } }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/login?callbackUrl=/responses/${id}`);
  }

  async function fetchResponse() {
    const response = await fetch(`http://localhost:5000/api/responses/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    const { data } = await response.json();
    return data;
  }

  const response = await fetchResponse();

  const browserName = getBrowserName(
    response.meta ? response.meta.userAgent : "other"
  );

  const componentsMap = {
    chrome: () => <FaChrome size={20} color='#4285F4' />,
    firefox: () => <FaFirefoxBrowser size={20} color='#FF9500' />,
    safari: () => <FaSafari size={20} color='#00A98F' />,
    edge: () => <FaEdge size={20} color='#0078D7' />,
  };

  const DynamicComponent = componentsMap[browserName];

  return (
    <div className='border-t border-t-gray-200 shadow-sm'>
      <div className='max-w-4xl mx-auto p-4 md:p-8'>
        <div className='p-6 flex items-center gap-4'>
          <div className='bg-blue-100 w-fit p-4 rounded-full -mt-2'>
            <FaUser size={36} className='text-blue-500' />
          </div>

          <div>
            <h2 className='text-2xl font-semibold'>
              Response #{trimIdToSixChars(response._id)}
            </h2>
            <p className='text-gray-500 text-sm'>
              Completed the{" "}
              <span className='text-gray-600 font-semibold'>
                {response.survey.title}
              </span>{" "}
              {timeAgo(response.submittedAt)}
            </p>

            {response.meta && (
              <div className='flex items-center gap-1 mt-2 '>
                <DynamicComponent />
                <p>{capitalizeString(browserName)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='bg-gray-50'>
        <div className='max-w-4xl mx-auto p-4 md:p-8'>
          <h3 className='mb-4 text-xl text-gray-500'>Responses</h3>
          {response.answers.map((answer, idx) => (
            <div
              key={answer._id}
              className='bg-white py-3 rounded-lg shadow-sm border border-gray-200 my-4'
            >
              <p className='font-semibold py-2 px-4'>
                {idx + 1}. {answer.question.question}
              </p>
              <div className='flex items-center gap-2 py-2 px-4 border-t border-gray-200 text-sm text-gray-600 font-normal'>
                <FaCheck color='blue' />
                <p>{answer.answer} </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleResponse;
