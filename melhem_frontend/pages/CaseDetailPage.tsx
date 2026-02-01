
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  CheckCircle, 
  Clock, 
  FileText,
  AlertCircle,
  PlayCircle,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  Video,
  Instagram,
  Trophy,
  Edit2
} from 'lucide-react';
import { ClinicalCase, CaseStatus, User, UserRole, CaseMedia, ContentTone, PublishedResult } from '../types';

interface CaseDetailPageProps {
  cases: ClinicalCase[];
  user: User;
  onUpdateCase: (updatedCase: ClinicalCase) => void;
}

const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ cases, user, onUpdateCase }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const clinicalCase = cases.find(c => c.id === id);
  const [activeMedia, setActiveMedia] = useState<CaseMedia | null>(
    clinicalCase?.media[0] || null
  );

  const [showResultForm, setShowResultForm] = useState(false);
  const [resultData, setResultData] = useState<PublishedResult>(
    clinicalCase?.publishedResult || { type: 'link', content: '', caption: '' }
  );

  if (!clinicalCase) return <div className="p-10 text-center italic text-gray-500 text-xl font-serif">Keys tapılmadı.</div>;

  const handleStatusChange = (newStatus: CaseStatus) => {
    onUpdateCase({ ...clinicalCase, status: newStatus });
  };

  const handleToneChange = (newTone: ContentTone) => {
    onUpdateCase({ ...clinicalCase, tone: newTone });
  };

  const handleSaveResult = () => {
    onUpdateCase({ ...clinicalCase, publishedResult: resultData, status: CaseStatus.PUBLISHED });
    setShowResultForm(false);
  };

  const isMarketing = user.role === UserRole.MARKETING;
  const goBack = () => navigate('/dashboard');

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-24">
      {/* Success Banner */}
      {!isMarketing && clinicalCase.publishedResult && (
        <div className="bg-white border-2 border-brand-primary p-8 md:p-12 rounded-[40px] shadow-2xl shadow-violet-100 flex flex-col md:flex-row items-center gap-8 animate-in zoom-in duration-700">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-brand-mist rounded-[32px] flex items-center justify-center shrink-0 border-2 border-brand-lavender text-brand-primary shadow-inner">
            <Trophy size={48} strokeWidth={2.5} className="animate-bounce" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h3 className="text-3xl md:text-4xl font-bold text-brand-ink italic tracking-tight">Təbriklər, Keysiniz Paylaşılıb!</h3>
            <p className="text-lg text-brand-ink/60 font-medium leading-relaxed">
              {clinicalCase.publishedResult.caption || 'Keysiniz marketinq komandası tərəfindən uğurla yayımlanıb.'}
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            {clinicalCase.publishedResult.type === 'link' && (
              <a 
                href={clinicalCase.publishedResult.content} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 bg-brand-primary text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-violet-200 hover:bg-violet-700 transition-all active:scale-95 group"
              >
                <Instagram size={24} />
                <span>Paylaşıma Bax</span>
                <ExternalLink size={20} className="opacity-60 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={goBack}
          className="inline-flex items-center space-x-3 text-violet-400 hover:text-brand-primary transition-all group active:scale-95"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xl">Geri qayıt</span>
        </button>
        
        {isMarketing && (
          <div className="flex items-center space-x-4">
            <span className="text-xs font-black text-violet-300 uppercase tracking-widest">Status:</span>
            <select 
              value={clinicalCase.status}
              onChange={(e) => handleStatusChange(e.target.value as CaseStatus)}
              className="bg-white border border-violet-100 px-6 py-3 rounded-2xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/10 shadow-sm text-brand-ink italic"
            >
              {Object.values(CaseStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-8 md:p-14 rounded-[48px] border border-violet-50 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <span className="bg-brand-lavender text-brand-primary px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest italic">
                {clinicalCase.category}
              </span>
              <div className="flex items-center text-sm text-violet-300 font-bold">
                <Clock size={18} className="mr-2" />
                {new Date(clinicalCase.createdAt).toLocaleString('az-AZ')}
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-brand-ink mb-10 italic leading-tight">{clinicalCase.title}</h2>
            
            {/* Media Player Container */}
            <div className="relative rounded-[40px] overflow-hidden aspect-video shadow-2xl bg-brand-ink/5 border border-violet-50 group mb-10">
              {activeMedia?.type === 'image' ? (
                <img src={activeMedia.url} className="w-full h-full object-contain" alt="" />
              ) : (
                <video src={activeMedia?.url} controls className="w-full h-full object-contain" />
              )}
              
              {/* Badge Area */}
              <div className="absolute top-5 right-5 flex items-center gap-3">
                {clinicalCase.isAnonymous && (
                  <div className="bg-brand-ink/80 backdrop-blur-md text-white text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                    Anonim Pasiyent
                  </div>
                )}
                {isMarketing && (
                  <button 
                    onClick={() => navigate('/new-case')}
                    className="bg-brand-primary hover:bg-violet-700 text-white text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all active:scale-95 border border-white/20"
                  >
                    <Edit2 size={12} strokeWidth={3} />
                    Keysi Redaktə Et
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {clinicalCase.media.length > 1 && (
              <div className="flex gap-6 overflow-x-auto pb-6 mb-12 custom-scrollbar">
                {clinicalCase.media.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMedia(m)}
                    className={`relative w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden shrink-0 transition-all border-4 ${activeMedia?.url === m.url ? 'border-brand-primary scale-105 shadow-lg' : 'border-white hover:border-brand-lavender'}`}
                  >
                    {m.type === 'image' ? (
                      <img src={m.url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full bg-brand-ink flex items-center justify-center">
                        <PlayCircle className="text-white" size={32} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-12">
              <Section title="Pasiyent Problemi" content={clinicalCase.patientProblem} />
              <Section title="Müalicə Prosesi" content={clinicalCase.treatmentProcess} />
              <Section title="Nəticə" content={clinicalCase.result} />
            </div>
          </div>
        </div>

        {/* Sidebar Workspace */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[48px] border border-violet-50 shadow-sm sticky top-10">
            <h3 className="text-2xl font-bold text-brand-ink italic mb-8">
              {isMarketing ? 'İdarə Paneli' : 'Keys Statusu'}
            </h3>
            
            <div className="space-y-8">
              <div className="p-6 bg-brand-mist rounded-3xl border border-violet-50">
                <p className="text-xs font-black text-violet-400 uppercase tracking-widest mb-3">Cari Status</p>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${clinicalCase.status === CaseStatus.PUBLISHED ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                  <span className="font-bold text-xl text-brand-ink">{clinicalCase.status}</span>
                </div>
              </div>

              {isMarketing && (
                <div className="space-y-6 pt-8 border-t border-violet-50">
                   <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-violet-400 uppercase tracking-widest">Nəticə Əlavə Et</p>
                      <button onClick={() => setShowResultForm(!showResultForm)} className="text-brand-primary font-black text-xs hover:underline">
                        {clinicalCase.publishedResult ? 'Redaktə' : 'Yeni'}
                      </button>
                   </div>

                   {showResultForm && (
                      <div className="space-y-4 animate-in slide-in-from-top-4">
                        <input 
                          type="text" 
                          placeholder="Instagram Linki"
                          className="w-full px-5 py-4 rounded-xl bg-brand-mist border border-violet-100 font-medium text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-primary/10"
                          value={resultData.content}
                          onChange={(e) => setResultData({...resultData, content: e.target.value})}
                        />
                        <button onClick={handleSaveResult} className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg">Yadda Saxla</button>
                      </div>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string, content: string }> = ({ title, content }) => (
  <div className="space-y-4">
    <h4 className="text-xs font-black text-violet-400 uppercase tracking-widest flex items-center">
      <div className="w-2 h-2 rounded-full bg-brand-primary mr-3"></div>
      {title}
    </h4>
    <p className="text-brand-ink text-lg leading-relaxed font-medium">
      {content}
    </p>
  </div>
);

export default CaseDetailPage;
