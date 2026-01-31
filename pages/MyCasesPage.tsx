
import React from 'react';
import { ClinicalCase, CaseStatus } from '../types';
import { ChevronRight, FileText, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface MyCasesPageProps {
  cases: ClinicalCase[];
}

const MyCasesPage: React.FC<MyCasesPageProps> = ({ cases }) => {
  const navigate = useNavigate();
  
  const statusColors = {
    [CaseStatus.NEW]: 'bg-amber-100 text-amber-700',
    [CaseStatus.REVIEWED]: 'bg-blue-100 text-blue-700',
    [CaseStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-700',
    [CaseStatus.READY]: 'bg-green-100 text-green-700',
    [CaseStatus.PUBLISHED]: 'bg-[#0891B2] bg-opacity-10 text-[#0891B2]',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-deep-pink transition-all group active:scale-95 w-fit p-1 -ml-1"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-lg">Geri qayıt</span>
        </button>
        <h2 className="text-3xl font-bold text-gray-900 italic">Mənim Keyslərim ({cases.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map(c => (
          <Link key={c.id} to={`/case/${c.id}`} className="group block bg-white p-4 rounded-3xl border border-[#F3E8E6] hover:shadow-xl transition-all">
            <div className="relative mb-4 overflow-hidden rounded-2xl aspect-video">
              <img src={c.media[0]?.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
              <div className="absolute top-3 left-3">
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${statusColors[c.status]}`}>
                  {c.status}
                </span>
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2 truncate italic">{c.title}</h4>
            <p className="text-xs text-gray-500 mb-4 line-clamp-1">{c.shortDescription}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-[10px] font-bold text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
              <ChevronRight size={16} className="text-gray-200 group-hover:text-deep-pink" />
            </div>
          </Link>
        ))}
        {cases.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-[#F3E8E6]">
            <FileText size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 italic">Hələ heç bir keysiniz yoxdur.</p>
            <Link to="/new-case" className="mt-4 inline-block text-deep-pink font-bold hover:underline">İlk keysini əlavə et</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCasesPage;
