
import React, { useMemo } from 'react';
import { User, ClinicalCase, CaseStatus, UserRole } from '../types';
import { BarChart3, Eye, ChevronLeft, TrendingUp, Users, Award, CheckCircle2, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StatsPageProps {
  user: User;
  cases: ClinicalCase[];
}

const StatsPage: React.FC<StatsPageProps> = ({ user, cases }) => {
  const navigate = useNavigate();
  const isMarketing = user.role === UserRole.MARKETING;
  
  const relevantCases = useMemo(() => {
    return isMarketing ? cases : cases.filter(c => c.doctorId === user.id);
  }, [cases, isMarketing, user.id]);

  const metrics = useMemo(() => {
    const published = relevantCases.filter(c => c.status === CaseStatus.PUBLISHED).length;
    const total = relevantCases.length;
    const conversion = total > 0 ? Math.round((published / total) * 100) : 0;
    
    return {
      total,
      published,
      conversion,
      pending: relevantCases.filter(c => c.status === CaseStatus.NEW).length
    };
  }, [relevantCases]);

  // Mock activity data based on relevant cases count
  const activityData = isMarketing ? [15, 22, 18, 28, 24, 32, 45] : [4, 8, 5, 12, 7, 9, 15];
  const maxVal = Math.max(...activityData);

  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    relevantCases.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [relevantCases]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-7xl mx-auto pb-24">
      <div className="flex flex-col space-y-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-3 text-violet-400 hover:text-brand-primary transition-all group active:scale-95 w-fit p-1 -ml-1"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xl">Geri qayıt</span>
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-ink italic">Performans Analizi</h2>
            <p className="text-xl text-brand-ink/40 mt-2 font-medium">
              {isMarketing ? 'Hospital üzrə ümumi rəqəmsal performans' : 'Şəxsi fəaliyyətiniz və statistikalarınız'}
            </p>
          </div>
          <div className="bg-brand-lavender/50 px-6 py-3 rounded-2xl border border-violet-100 flex items-center space-x-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
             <span className="text-sm font-bold text-brand-primary uppercase tracking-widest">Real-Time Data</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <StatItem 
          icon={<Eye size={24} className="text-brand-primary" />} 
          label="Paylaşılan" 
          value={metrics.published.toString()} 
          trend="+12%"
        />
        <StatItem 
          icon={<BarChart3 size={24} className="text-brand-secondary" />} 
          label="Cəmi Keyslər" 
          value={metrics.total.toString()} 
          trend="+5%"
        />
        <StatItem 
          icon={<TrendingUp size={24} className="text-emerald-500" />} 
          label="Effektivlik" 
          value={`${metrics.conversion}%`} 
          trend="Stabil"
        />
        <StatItem 
          icon={<Users size={24} className="text-violet-400" />} 
          label={isMarketing ? "Aktiv Həkimlər" : "Nailiyyətlər"} 
          value={isMarketing ? "24" : "12"} 
          trend="+2"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
        <div className="lg:col-span-2 bg-white p-8 md:p-14 rounded-[48px] md:rounded-[60px] border border-violet-50 shadow-sm violet-shadow">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl md:text-3xl font-bold italic text-brand-ink">Dinamika (Son 7 Ay)</h3>
            <div className="flex items-center space-x-2 text-violet-300 font-bold text-sm italic">
              <CheckCircle2 size={16} />
              <span>Yalnız təsdiqlənmiş keyslər</span>
            </div>
          </div>
          <div className="h-72 flex items-end justify-between gap-3 md:gap-6">
            {activityData.map((val, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  style={{ height: `${(val / maxVal) * 100}%` }} 
                  className="bg-brand-lavender group-hover:bg-brand-primary transition-all rounded-t-2xl cursor-pointer shadow-inner"
                ></div>
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-brand-ink text-white text-[11px] px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-2xl font-black z-10">
                  {val} Keys
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-8 text-[10px] md:text-xs font-bold text-violet-300 uppercase tracking-[0.2em] border-t border-violet-50 pt-8">
            <span>Yan</span><span>Fev</span><span>Mar</span><span>Apr</span><span>May</span><span>İyun</span><span>İyul</span>
          </div>
        </div>

        <div className="bg-white p-10 md:p-14 rounded-[48px] border border-violet-50 shadow-sm violet-shadow space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold italic text-brand-ink">Bölmələr</h3>
            <PieChart size={20} className="text-violet-200" />
          </div>
          <div className="space-y-6">
            {categoryBreakdown.map(([cat, count], idx) => (
              <div key={cat} className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-brand-ink italic">{cat}</span>
                  <span className="text-brand-primary">{count}</span>
                </div>
                <div className="w-full h-2.5 bg-brand-mist rounded-full overflow-hidden border border-violet-50">
                  <div 
                    style={{ width: `${(count / metrics.total) * 100}%` }} 
                    className={`h-full transition-all duration-1000 delay-${idx * 100} ${idx === 0 ? 'bg-brand-primary' : 'bg-brand-secondary opacity-60'}`}
                  ></div>
                </div>
              </div>
            ))}
            {categoryBreakdown.length === 0 && (
              <p className="text-center py-10 text-violet-300 italic font-medium">Məlumat yoxdur</p>
            )}
          </div>
          <div className="pt-6 border-t border-violet-50">
             <p className="text-[10px] font-bold text-violet-300 uppercase tracking-widest text-center">Top 5 Ən Aktiv Şöbə</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) => (
  <div className="bg-white p-8 md:p-10 rounded-[40px] border border-violet-50 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all violet-shadow group">
    <div className="mb-6 w-16 h-16 md:w-20 md:h-20 bg-brand-mist rounded-[28px] border border-violet-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">{label}</p>
    <p className="text-3xl md:text-5xl font-black text-brand-ink italic tracking-tight tabular-nums mb-3">{value}</p>
    <div className="flex items-center space-x-1.5 px-3 py-1 bg-brand-lavender/40 rounded-full border border-violet-50">
       <TrendingUp size={10} className="text-brand-primary" />
       <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">{trend}</span>
    </div>
  </div>
);

export default StatsPage;
