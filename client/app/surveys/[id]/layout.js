import Header from "../../components/header";

export const metadata = {
  title: "Survey Overview| Pollapex",
};

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className='bg-gray-50 min-h-screen'>{children}</div>
    </>
  );
};

export default Layout;
