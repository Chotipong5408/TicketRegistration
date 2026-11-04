import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../data/permissions";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Ticket,
  ShoppingCart,
  CreditCard,
  ShieldCheck,
  Store,
  Coins,
  ScanLine,
  BarChart3,
  FileText,
  Settings,
  User,
  Wallet,
  History,
  Shirt,
  QrCode,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Package,
  BadgeCheck,
  CircleDollarSign,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const NAV = {
  user: [],
  super_admin: [],
  token_admin: [
    { label: "Dashboard", to: "/token-admin/dashboard", icon: LayoutDashboard },
    { label: "เติม Token", to: "/token-admin/topup", icon: CircleDollarSign },
    { label: "ประวัติธุรกรรม", to: "/token-admin/transactions", icon: History },
    { label: "สแกน QR ผู้ใช้", to: "/token-admin/scan", icon: ScanLine },
  ],
  store_admin: [
    { label: "Dashboard", to: "/store/dashboard", icon: LayoutDashboard },
    { label: "จัดการสินค้า", to: "/store/product", icon: Package },
    { label: "สร้าง QR ขาย", to: "/store/payment-requests", icon: QrCode },
    { label: "สแกนรับชำระ", to: "/store/scan-payment", icon: ScanLine },
    { label: "ประวัติธุรกรรม", to: "/store/transactions", icon: History },
    { label: "รายงานร้านค้า", to: "/store/reports", icon: BarChart3 },
  ],
};

function SidebarLinks({ items, pathname, onClick }) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.to;
        const isHighlight = item.highlight;

        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClick}
            className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
              active
                ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-sm shadow-brand-500/20"
                : isHighlight
                  ? "bg-brand-50/80 text-brand-900 border border-brand-200/80 hover:bg-brand-100 hover:text-brand-950 font-bold"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform ${
                  active
                    ? "text-white"
                    : isHighlight
                      ? "text-brand-600 scale-110"
                      : "text-slate-400 group-hover:text-brand-600"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {item.badge && !active && (
                <span className="rounded-full bg-brand-600 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs">
                  {item.badge}
                </span>
              )}
              {active && (
                <ChevronRight className="h-3.5 w-3.5 text-white/70 shrink-0" />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const role = user?.role || "user";
  const roleItems = NAV[role] || [];
  const accountItems = role !== "user" ? NAV.user : [];

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return <></>;
}
