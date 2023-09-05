import Header from "../components/header";

export const metadata = {
  title: "Surveys | Pollapex",
};

const SurveysLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white'>
        <Header />
      </div>
      <div className='bg-gray-50'>{children}</div>
    </div>
  );
};

export default SurveysLayout;
