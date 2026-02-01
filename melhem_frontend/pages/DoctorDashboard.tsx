
import React from 'react';
import { ClinicalCase, User, CaseStatus } from '../types';
import { ChevronRight, Plus, Users, Share2, Award, Sparkles } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';


const DoctorDashboard: React.FC = () => {
    if (!localStorage.getItem("access")) {
    return <Navigate to="/login" />;
  }

    // TEMP DATA (sonra API ilə dəyişəcəyik)
  const cases: ClinicalCase[] = [];
  const user: User = {
    name: "Doktor"
  } as any;

  const publishedCases = cases.filter(c => c.status === CaseStatus.PUBLISHED).length;
  const inProgress = cases.filter(c => c.status === CaseStatus.REVIEWED || c.status === CaseStatus.IN_PROGRESS).length;
  const badgeCount = 2;

  return (
    <div className="space-y-8 md:space-y-14 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-2 md:space-y-3">
          <p className="text-[10px] md:text-xs font-black text-brand-primary uppercase tracking-[0.3em] opacity-60">Xoş gəldiniz</p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-brand-ink italic leading-tight tracking-tight">Hörmətli, {user.name}</h2>
          <p className="text-base sm:text-xl md:text-2xl text-brand-ink/40 font-medium">Bu gün hansı klinik müvəffəqiyyətinizi işıqlandırırıq?</p>
        </div>
        <Link 
          to="/new-case"
          className="hidden md:flex bg-brand-primary text-white px-10 py-5 rounded-[24px] font-black items-center justify-center space-x-4 hover:bg-violet-700 transition-all shadow-xl shadow-violet-100 active:scale-95 group"
        >
          <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
          <span className="text-xl">Yeni Keys</span>
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-10">
        <StatCard 
          icon={<Share2 className="text-brand-primary" />} 
          label="Paylaşılan" 
          value={publishedCases} 
          color="bg-white" 
          accent="border-violet-100"
        />
        <StatCard 
          icon={<Users className="text-brand-secondary" />} 
          label="Hazırlıq" 
          value={inProgress} 
          color="bg-white" 
          accent="border-violet-100"
        />
        <Link to="/badges" className="col-span-2 lg:col-span-1">
          <StatCard 
            icon={<Award className="text-gold" />} 
            label="Nailiyyətlər" 
            value={badgeCount} 
            color="bg-white" 
            accent="border-yellow-100"
            isInteractive
          />
        </Link>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-16 items-start">
        {/* Recent Cases List */}
        <section className="xl:col-span-2 space-y-6 md:space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-3xl font-bold text-brand-ink italic">Sonuncu Keysləriniz</h3>
            <Link to="/my-cases" className="text-brand-primary text-[10px] md:text-base font-black hover:underline uppercase tracking-widest flex items-center space-x-2 md:space-x-3">
              <span>Hamısı</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
            {cases.slice(0, 4).map(c => (
              <CaseCard key={c.id} clinicalCase={c} />
            ))}
            {cases.length === 0 && (
              <div className="col-span-full py-16 md:py-32 text-center glass-card rounded-[32px] md:rounded-[48px] border-2 border-dashed border-violet-100">
                <Sparkles size={40} className="mx-auto text-violet-200 mb-4 md:mb-8" />
                <p className="text-brand-ink/40 font-bold italic text-lg md:text-2xl px-6">Hələ heç bir keys əlavə edilməyib.</p>
                <Link to="/new-case" className="mt-6 md:mt-10 inline-block bg-brand-lavender text-brand-primary px-8 py-3.5 rounded-2xl font-black hover:bg-violet-100 transition-all text-base md:text-lg">İlk addımı at</Link>
              </div>
            )}
          </div>
        </section>

        {/* Ranking List */}
        <aside className="space-y-6 md:space-y-10">
          <h3 className="text-xl md:text-3xl font-bold text-brand-ink italic">Reytinq Cədvəli</h3>
          <div className="glass-card p-5 md:p-10 rounded-[32px] md:rounded-[48px] violet-shadow space-y-4 md:space-y-8 border border-violet-50">
            <RankingItem rank={1} name="Dr. Leyla Əliyeva" count={12} img="https://picsum.photos/seed/doc1/100/100" isTop />
            <RankingItem rank={2} name="Dr. Emil Qasımov" count={8} img="https://picsum.photos/seed/doc2/100/100" />
            <RankingItem rank={3} name="Dr. Fərid Məmmədov" count={5} img="https://picsum.photos/seed/doc3/100/100" />
            <div className="pt-4 md:pt-6 border-t border-violet-50">
              <p className="text-[10px] md:text-xs text-violet-400 font-bold text-center italic uppercase tracking-widest">Ən aktiv həkimlər</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, accent, isInteractive }: any) => (
  <div className={`${color} p-5 md:p-10 rounded-[28px] md:rounded-[40px] border ${accent} violet-shadow flex items-center justify-between group transition-all duration-500 ${isInteractive ? 'hover:-translate-y-1 cursor-pointer active:scale-95' : ''}`}>
    <div className="min-w-0">
      <p className="text-[9px] md:text-xs font-black text-violet-400 uppercase tracking-[0.2em] mb-1 md:mb-2 truncate">{label}</p>
      <p className="text-3xl md:text-5xl font-black text-brand-ink tabular-nums">{value}</p>
    </div>
    <div className="w-11 h-11 md:w-20 md:h-20 bg-brand-mist rounded-[16px] md:rounded-[28px] border border-violet-50 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
      {React.cloneElement(icon, { size: 24, className: `${icon.props.className} md:w-8 md:h-8`, strokeWidth: 2 })}
    </div>
  </div>
);

const CaseCard: React.FC<{ clinicalCase: ClinicalCase }> = ({ clinicalCase }) => {
  const statusColors = {
    [CaseStatus.NEW]: 'bg-amber-100 text-amber-700',
    [CaseStatus.REVIEWED]: 'bg-violet-50 text-brand-primary',
    [CaseStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-700',
    [CaseStatus.READY]: 'bg-emerald-100 text-emerald-700',
    [CaseStatus.PUBLISHED]: 'bg-brand-primary text-white',
  };

  return (
    <Link to={`/case/${clinicalCase.id}`} className="group block bg-white p-3.5 md:p-8 rounded-[28px] md:rounded-[40px] border border-violet-50 violet-shadow hover:shadow-xl transition-all duration-300">
      <div className="relative mb-4 md:mb-8 overflow-hidden rounded-[20px] md:rounded-[32px] aspect-[4/3] bg-violet-50 shadow-inner">
        <img 
          src={clinicalCase.media[0]?.url || 'https://picsum.photos/800/600'} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt="" 
        />
        <div className="absolute top-2.5 left-2.5 md:top-5 md:left-5">
          <span className={`text-[8px] md:text-xs font-black px-2.5 py-1 md:px-5 md:py-2.5 rounded-full uppercase tracking-[0.15em] shadow-lg ${statusColors[clinicalCase.status]}`}>
            {clinicalCase.status}
          </span>
        </div>
      </div>
      <div className="space-y-1.5 md:space-y-4 px-1">
        <h4 className="text-lg md:text-3xl font-bold text-brand-ink italic truncate group-hover:text-brand-primary transition-colors">{clinicalCase.title}</h4>
        <p className="text-xs md:text-lg text-brand-ink/50 font-medium line-clamp-1 md:line-clamp-2 leading-relaxed">
          {clinicalCase.shortDescription}
        </p>
        <div className="flex items-center justify-between pt-4 md:pt-8 border-t border-violet-50 mt-3 md:mt-6">
          <span className="text-[10px] md:text-sm font-black text-violet-400 uppercase tracking-widest">{new Date(clinicalCase.createdAt).toLocaleDateString()}</span>
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-brand-lavender flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
            <ChevronRight size={18} strokeWidth={3} />
          </div>
        </div>
      </div>
    </Link>
  );
};

const RankingItem = ({ rank, name, count, img, isTop }: any) => (
  <div className={`flex items-center justify-between p-3 md:p-6 rounded-[20px] md:rounded-[32px] transition-all ${isTop ? 'bg-violet-50/50 border border-violet-100' : 'hover:bg-violet-50/30'}`}>
    <div className="flex items-center space-x-3 md:space-x-6 min-w-0">
      <span className={`w-7 h-7 md:w-12 md:h-12 rounded-lg md:rounded-[18px] flex items-center justify-center font-black text-[10px] md:text-lg shrink-0 ${isTop ? 'bg-gold text-white shadow-md' : 'bg-violet-100 text-violet-400'}`}>
        {rank}
      </span>
      <img src={img} className="w-9 h-9 md:w-16 md:h-16 rounded-[14px] md:rounded-[24px] object-cover border-2 border-white shadow-sm shrink-0" alt="" />
      <div className="min-w-0">
        <p className={`font-black text-xs md:text-lg italic truncate ${isTop ? 'text-brand-primary' : 'text-brand-ink'}`}>{name}</p>
        <p className="text-[9px] md:text-xs font-bold text-violet-400 uppercase tracking-widest">{count} Keys</p>
      </div>
    </div>
    {isTop && <Award className="text-gold shrink-0" size={18} strokeWidth={2.5} />}
  </div>
);

export default DoctorDashboard;
