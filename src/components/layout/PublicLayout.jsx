import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GraduationCap, LogIn, UserPlus, Ticket, Shirt } from "lucide-react";

export default function PublicLayout() {
  const { user } = useAuth();
  const nav = useNavigate();

  return <></>;
}
