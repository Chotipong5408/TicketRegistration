import UserRoleManagement from "./pages/UserRoleManagement";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Carts from "./pages/carts";


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

        <Route path="/carts" element={<Carts />} />


        {/* Event Admin — เปิดใช้เมื่อ import ด้านบนพร้อมแล้ว
        <Route
          path="/token-admin/dashboard"
          element={
            <RequireRole roles={["super_admin", "token_admin"]}>
              <TokenDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/token-admin/topup"
          element={
            <RequireRole roles={["super_admin", "token_admin"]}>
              <TokenTopup />
            </RequireRole>
          }
        />
        <Route
          path="/token-admin/transactions"
          element={
            <RequireRole roles={["super_admin", "token_admin"]}>
              <TokenTransactions />
            </RequireRole>
          }
        />
        <Route
          path="/token-admin/scan"
          element={
            <RequireRole roles={["super_admin", "token_admin"]}>
              <TokenScan />
            </RequireRole>
          }
        />
        */}

        {/* Store Admin — เปิดใช้เมื่อ import ด้านบนพร้อมแล้ว
        <Route
          path="/store/dashboard"
          element={
            <RequireRole roles={["super_admin", "store_admin"]}>
              <StoreDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/store/product"
          element={
            <RequireRole roles={["super_admin", "store_admin"]}>
              <StoreProduct />
            </RequireRole>
          }
        />
        <Route
          path="/store/payment-requests"
          element={
            <RequireRole roles={["super_admin", "store_admin"]}>
              <StorePaymentRequests />
            </RequireRole>
          }
        />
        <Route
          path="/store/scan-payment"
          element={
            <RequireRole roles={["super_admin", "store_admin"]}>
              <StoreScanPayment />
            </RequireRole>
          }
        />
        <Route
          path="/store/transactions"
          element={
            <RequireRole roles={["super_admin", "store_admin"]}>
              <StoreTransactions />
            </RequireRole>
          }
        />
        <Route
          path="/store/reports"
          element={
            <RequireRole roles={["super_admin", "store_admin"]}>
              <StoreReports />
            </RequireRole>
          }
        />
        */}

      </Routes>
    </BrowserRouter>
  );
}
export default App;