import Header from "../components/header";

export const metadata = {
  title: "Dashboard | Pollapex",
};

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className='bg-gray-50'>{children}</div>
    </>
  );
};

export default DashboardLayout;
