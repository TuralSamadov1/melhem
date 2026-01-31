
import React, { useState, useMemo } from 'react';
import { ClinicalCase, CaseStatus, ContentTone } from '../types';
import { Search, Hash, Sparkles, X, ChevronRight, BarChart3, Clock, CheckCircle2, Files } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MarketingDashboardProps {
  cases: ClinicalCase[];
}

const MarketingDashboard: React.FC<MarketingDashboardProps> = ({ cases }) => {
  const [filterStatus, setFilterStatus] = useState<CaseStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTone, setSelectedTone] = useState<ContentTone | 'ALL'>('ALL');

  const stats = useMemo(() => {
    return {
      total: cases.length,
      pending: cases.filter(c => c.status === CaseStatus.NEW).length,
      published: cases.filter(c => c.status === CaseStatus.PUBLISHED).length,
      inProgress: cases.filter(c => c.status === CaseStatus.REVIEWED || c.status === CaseStatus.IN_PROGRESS).length
    };
  }, [cases]);

  const categories = useMemo(() => {
    const cats = cases.map(c => c.category);
    return ['ALL', ...Array.from(new Set(cats))];
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
      const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
      const matchesTone = selectedTone === 'ALL' || c.tone === selectedTone;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        c.title.toLowerCase().includes(searchLower) ||
        c.doctorName.toLowerCase().includes(searchLower) ||
        c.shortDescription.toLowerCase().includes(searchLower);

      return matchesStatus && matchesCategory && matchesTone && matchesSearch;
    });
  }, [cases, filterStatus, searchTerm, selectedCategory, selectedTone]);

  const clearFilters = () => {
    setFilterStatus('ALL');
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedTone('ALL');
  };

  return (
    <div className="space-y-10 md:space-y-14 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-ink italic">Gələn Keyslər</h2>
          <p className="text-xl text-brand-ink/40 mt-2 font-medium">Həkimlərdən gələn yeni materialları nəzərdən keçirin</p>
        </div>
        <Link to="/stats" className="flex items-center space-x-3 px-6 py-3 bg-brand-lavender text-brand-primary rounded-2xl font-bold hover:bg-violet-100 transition-all active:scale-95 border border-violet-100">
          <BarChart3 size={20} />
          <span>Ətraflı Statistika</span>
        </Link>
      </header>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <SummaryCard icon={<Files className="text-brand-primary" />} label="Cəmi" value={stats.total} color="bg-white" />
        <SummaryCard icon={<Clock className="text-amber-500" />} label="Yeni" value={stats.pending} color="bg-white" />
        <SummaryCard icon={<Sparkles className="text-violet-400" />} label="Hazırlanır" value={stats.inProgress} color="bg-white" />
        <SummaryCard icon={<CheckCircle2 className="text-emerald-500" />} label="Paylaşıldı" value={stats.published} color="bg-white" />
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-300 group-focus-within:text-brand-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Həkim adı və ya mövzu ilə axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-4.5 rounded-2xl bg-white border border-violet-100 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary shadow-sm transition-all font-medium text-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-200 hover:text-violet-400">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-300" size={16} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-11 pr-10 py-4.5 rounded-2xl bg-white border border-violet-100 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary shadow-sm appearance-none font-bold text-brand-ink text-sm italic"
            >
              <option value="ALL">Bütün Bölmələr</option>
              {categories.filter(cat => cat !== 'ALL').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-300" size={16} />
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value as any)}
              className="w-full pl-11 pr-10 py-4.5 rounded-2xl bg-white border border-violet-100 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary shadow-sm appearance-none font-bold text-brand-ink text-sm italic"
            >
              <option value="ALL">Bütün Tonlar</option>
              {Object.values(ContentTone).map(tone => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-6 border-b border-violet-50 overflow-x-auto custom-scrollbar whitespace-nowrap scroll-smooth pb-px -mx-5 px-5 md:mx-0 md:px-0">
          {['ALL', ...Object.values(CaseStatus)].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`pb-5 text-xs font-bold transition-all relative shrink-0 uppercase tracking-[0.2em] ${
                filterStatus === status ? 'text-brand-primary' : 'text-violet-300 hover:text-brand-primary/60'
              }`}
            >
              {status === 'ALL' ? 'Hamısı' : status}
              {filterStatus === status && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-brand-primary rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredCases.map(c => (
          <Link 
            key={c.id} 
            to={`/case/${c.id}`}
            className="group bg-white p-6 md:p-8 rounded-[40px] border border-violet-50 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col sm:flex-row gap-6 md:gap-8 violet-shadow"
          >
            <div className="w-full sm:w-40 md:w-48 h-48 sm:h-auto rounded-[32px] overflow-hidden shrink-0 bg-brand-mist border border-violet-100">
              <img 
                src={c.media[0]?.url || 'https://picsum.photos/400/400'} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={c.title} 
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col py-2">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest ${
                  c.status === CaseStatus.PUBLISHED ? 'bg-brand-primary text-white shadow-lg shadow-violet-100' : 'bg-brand-lavender text-brand-primary'
                }`}>
                  {c.status}
                </span>
                <span className="text-[10px] text-violet-300 font-bold">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-brand-ink mb-2 italic truncate group-hover:text-brand-primary transition-colors">
                {c.title}
              </h3>
              
              <div className="flex items-center space-x-3 mb-4">
                <p className="text-sm font-bold text-brand-primary italic">{c.doctorName}</p>
                <div className="w-1.5 h-1.5 rounded-full bg-violet-100"></div>
                <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">{c.category}</p>
              </div>

              <p className="text-base text-brand-ink/50 line-clamp-2 mb-auto leading-relaxed font-medium">
                {c.shortDescription}
              </p>
            </div>
            <div className="hidden sm:flex items-center self-center text-violet-200 group-hover:text-brand-primary group-hover:translate-x-2 transition-all">
              <ChevronRight size={32} strokeWidth={3} />
            </div>
          </Link>
        ))}

        {filteredCases.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white rounded-[60px] border-2 border-dashed border-violet-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-brand-mist rounded-full flex items-center justify-center text-violet-200 mb-8">
              <Search size={48} />
            </div>
            <p className="text-brand-ink/40 font-bold italic text-2xl mb-8 px-6">Axtarış meyarlarına uyğun keys tapılmadı.</p>
            <button 
              onClick={clearFilters}
              className="bg-brand-primary text-white px-12 py-5 rounded-3xl font-bold text-lg shadow-2xl shadow-violet-200 hover:bg-violet-700 transition-all active:scale-95"
            >
              Filtrləri təmizlə
            </button>
          </div>
        )}
      </div>
      <style>{`
        .py-4\\.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
      `}</style>
    </div>
  );
};

const SummaryCard = ({ icon, label, value, color }: any) => (
  <div className={`${color} p-6 md:p-8 rounded-[32px] border border-violet-50 violet-shadow flex items-center space-x-6 group transition-all`}>
    <div className="w-14 h-14 md:w-16 md:h-16 bg-brand-mist rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform shrink-0">
      {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl md:text-3xl font-black text-brand-ink tabular-nums">{value}</p>
    </div>
  </div>
);

export default MarketingDashboard;
