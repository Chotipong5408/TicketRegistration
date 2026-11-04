import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

// TODO: เปิด route ของ token/store เมื่อได้ไฟล์ที่ขาดจากเพื่อนครบแล้ว
// ไฟล์ที่ยังไม่มีใน repo:
//   - context/AuthContext (useAuth)
//   - components/RequireRole
//   - pages/store/Dashboard
//   - lib/money, lib/csv, lib/dates, lib/qr
//   - repositories/index.js, hooks/useLiveData.js (ยังเป็นไฟล์ว่าง)
//   - services/storeService
//   - components/ui/PageHeader, DataTable, StatusBadge, components/QrScanner
//   - dependency: lucide-react
//
// import RequireRole from "./components/RequireRole";
// import TokenDashboard from "./pages/token/Dashboard";
// import TokenTopup from "./pages/token/Topup";
// import TokenTransactions from "./pages/token/Transactions";
// import TokenScan from "./pages/token/Scan";
// import StoreDashboard from "./pages/store/Dashboard";
// import StoreProduct from "./pages/store/Product";
// import StorePaymentRequests from "./pages/store/PaymentRequests";
// import StoreScanPayment from "./pages/store/ScanPayment";
// import StoreTransactions from "./pages/store/Transactions";
// import StoreReports from "./pages/store/Reports";

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
