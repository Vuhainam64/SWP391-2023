import { Main, Sidebar } from "../components/Employee";

function Employee() {
  return (
    <div className="w-screen h-screen flex items-center bg-white">
      <Sidebar />
      <Main />
    </div>
  );
}

export default Employee;
