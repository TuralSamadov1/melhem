import { useEffect, useState } from "react";
import { getMe } from "@/services/auth";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return <div className="p-10">Yüklənir...</div>;
  }

  if (!user) {
    return <div className="p-10">Profil məlumatı tapılmadı</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">Profil</h1>

      <div className="space-y-4 bg-white p-6 rounded-2xl shadow">
        <Info label="Ad Soyad" value={user.full_name} />
        <Info label="E-poçt" value={user.email} />
        <Info label="Rol" value={user.role} />

        {user.degree && <Info label="Dərəcə" value={user.degree} />}
        {user.specialty && <Info label="İxtisas" value={user.specialty} />}
        {user.whatsapp && <Info label="WhatsApp" value={user.whatsapp} />}
        {user.instagram && <Info label="Instagram" value={user.instagram} />}
        {user.website && <Info label="Website" value={user.website} />}
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value || "-"}</span>
  </div>
);

export default ProfilePage;
