
import React from 'react';
import { User } from '../types';
import { Award, Star, Zap, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BadgesPage: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col space-y-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-3 text-violet-400 hover:text-brand-primary transition-all group active:scale-95 w-fit p-1 -ml-1"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xl">Geri qayıt</span>
        </button>
        <h2 className="text-4xl md:text-5xl font-bold text-brand-ink italic">Nailiyyətləriniz</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        <BadgeCard icon={<Award size={32} className="text-gold" />} title="Ayın Həkimi" desc="Ay ərzində ən çox keys paylaşan hospital həkimi." date="Avqust 2024" earned />
        <BadgeCard icon={<Star size={32} className="text-brand-primary" />} title="Aktiv Paylaşımçı" desc="Ardıcıl 5 gün sistemə keys əlavə etdiyiniz üçün." date="İyul 2024" earned />
        <BadgeCard icon={<Zap size={32} className="text-violet-300" />} title="Trend Pioneri" desc="Yeni rəqəmsal trendləri ilk tətbiq edən mütəxəssis." earned={false} />
      </div>
    </div>
  );
};

const BadgeCard = ({ icon, title, desc, date, earned = true }: any) => (
  <div className={`p-10 md:p-14 rounded-[40px] md:rounded-[60px] border transition-all flex flex-col items-center text-center group ${earned ? 'bg-white border-violet-50 shadow-sm violet-shadow' : 'bg-brand-mist/50 border-dashed border-violet-100 grayscale opacity-40'}`}>
    <div className={`w-20 h-20 md:w-28 md:h-28 rounded-[28px] md:rounded-[40px] flex items-center justify-center mb-8 shadow-inner border transition-transform group-hover:scale-105 ${earned ? 'bg-brand-mist border-violet-50' : 'bg-gray-100 border-gray-200'}`}>
      {icon}
    </div>
    <h3 className="text-2xl md:text-3xl font-bold text-brand-ink mb-3 italic tracking-tight">{title}</h3>
    <p className="text-sm md:text-lg text-brand-ink/50 mb-6 leading-relaxed font-medium">{desc}</p>
    {earned ? (
      <div className="px-5 py-2 bg-brand-lavender/50 rounded-full">
        <span className="text-[10px] md:text-xs font-black text-brand-primary uppercase tracking-widest">{date}</span>
      </div>
    ) : (
      <span className="text-[10px] md:text-xs font-black text-violet-300 uppercase tracking-widest italic">Kilidli</span>
    )}
  </div>
);

export default BadgesPage;
