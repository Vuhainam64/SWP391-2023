import { DBLeftSection, DBRightSection } from "../components/Admin";

function Dashboard() {
  return (
    <div className="w-screen h-screen flex items-center bg-white">
      <DBLeftSection />
      <DBRightSection />
    </div>
  );
}

export default Dashboard;
