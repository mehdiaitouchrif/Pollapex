import Header from "../components/header";

export const metadata = {
  title: "Responses | Pollapex",
};

const ResponsesLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className='bg-gray-50'>{children}</div>
    </>
  );
};

export default ResponsesLayout;
