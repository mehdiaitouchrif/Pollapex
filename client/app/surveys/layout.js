import Header from "../components/header";

export const metadata = {
  title: "Surveys | Pollapex",
};

const SurveysLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className='bg-gray-50'>{children}</div>
    </>
  );
};

export default SurveysLayout;
