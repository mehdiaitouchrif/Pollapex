import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SurveyOverview from "@/components/surveyOverview";
import SurveyNavigation from "@/components/surveyNavigation";

export default async function SurveyLayout({ children, params: { id } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callbackUrl=/surveys/${id}`);
  }

  return (
    <div>
      <SurveyOverview id={id} />
      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto p-3 my-8 md:p-8">
          <SurveyNavigation id={id} />
          {children}
        </div>
      </div>
    </div>
  );
}
