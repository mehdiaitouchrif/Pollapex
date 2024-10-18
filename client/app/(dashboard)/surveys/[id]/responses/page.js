import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { fetchSurveyResponses } from "@/utils/apiUtils/responses";

const ResponsesPage = async ({ params: { id } }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/login?callbackUrl=/surveys/${id}`);
  }

  const responses = await fetchSurveyResponses(id, session?.user?.token);

  return (
    responses?.length > 0 && (
      <div className="px-4 py-2 my-4 rounded-lg bg-white shadow">
        {responses?.map((response, idx) => (
          <div
            key={response._id}
            className={`flex items-center justify-between py-2 my-2 border-b ${
              idx === responses.length - 1
                ? "border-b-transparent"
                : "border-b-gray-100"
            }`}
          >
            <div className="mr-2">
              <h4 className="font-semibold">Response number {idx + 1}</h4>

              <p className="mb-2 text-sm text-gray-400">
                Completed on {new Date(response.submittedAt).toLocaleString()}{" "}
              </p>
            </div>

            <Link
              className="rounded-lg shodow py-2 px-4 border border-gray-200 hover:bg-gray-50 duration-150 ease-in-out"
              href={`/responses/${response._id}`}
            >
              View
            </Link>
          </div>
        ))}
      </div>
    )
  );
};

export default ResponsesPage;
