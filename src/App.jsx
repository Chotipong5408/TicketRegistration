import UserRoleManagement from "./pages/UserRoleManagement";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

function Home() {
  return (
    <>
      <h1>
        hi

        Leo
      </h1>
      <span>name</span>
      <span>age</span>
      <span>date</span>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/users" element={<UserRoleManagement />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
