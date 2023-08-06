import Header from "../../components/header";

export const metadata = {
  title: "Create Survey | Pollapex",
};

const Layout = ({ children }) => {
  return (
    <>
      {/* <Header /> */}
      <div className='bg-gray-50'>{children}</div>
    </>
  );
};

export default Layout;
