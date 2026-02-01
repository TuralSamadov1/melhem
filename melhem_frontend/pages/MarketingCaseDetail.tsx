import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCase } from "@/services/cases";

const MarketingCaseDetail = () => {
  const { id } = useParams();
  const [caseItem, setCaseItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getCase(id)
      .then(setCaseItem)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-20 text-center text-xl font-bold text-violet-400">Yüklənir...</div>;
  }

  if (!caseItem) {
    return <div className="p-20 text-center">Case tapılmadı</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-bold">{caseItem.title}</h1>

      <p className="text-gray-700 text-lg">
        {caseItem.description || caseItem.shortDescription}
      </p>

      <div className="text-sm text-gray-500 space-y-1">
        <p><b>Həkim:</b> {caseItem.doctor_name || caseItem.doctorName}</p>
        <p><b>Status:</b> {caseItem.status}</p>
        <p><b>Tarix:</b> {new Date(caseItem.created_at || caseItem.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default MarketingCaseDetail;
