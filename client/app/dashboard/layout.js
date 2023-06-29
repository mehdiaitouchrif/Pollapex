import Header from "../components/header";

export const metadata = {
  title: "Dashboard | Pollapex",
};

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default DashboardLayout;
