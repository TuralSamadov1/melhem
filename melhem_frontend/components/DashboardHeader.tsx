import { useNavigate } from "react-router-dom";
import { logout } from "@/services/auth";

type Props = {
  role: "DOCTOR" | "MARKETING";
};

const DashboardHeader = ({ role }: Props) => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate(role === "DOCTOR" ? "/doctor/profile" : "/marketing/profile");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-white border-b">
      <div className="font-bold text-lg">
        {role === "DOCTOR" ? "Doctor Dashboard" : "Marketing Dashboard"}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleProfile}
          className="text-sm underline text-gray-700"
        >
          Profilim
        </button>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 font-medium"
        >
          Çıxış
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
