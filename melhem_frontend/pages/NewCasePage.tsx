
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Check, ChevronLeft, Image as ImageIcon, X, Video } from 'lucide-react';
import { ClinicalCase, User, ContentTone, CaseStatus, CaseMedia } from '../types';

interface NewCasePageProps {
  user: User;
  onAddCase: (newCase: ClinicalCase) => void;
}

const NewCasePage: React.FC<NewCasePageProps> = ({ user, onAddCase }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Ginekologiya',
    shortDescription: '',
    patientProblem: '',
    treatmentProcess: '',
    result: '',
    isAnonymous: true,
    isSuitableForSharing: true,
  });

  const [mediaFiles, setMediaFiles] = useState<CaseMedia[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newMedia: CaseMedia[] = Array.from(files).map((file: File) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image'
    }));

    setMediaFiles(prev => [...prev, ...newMedia]);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: ClinicalCase = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: user.id,
      doctorName: user.name,
      ...formData,
      tone: ContentTone.EDUCATIONAL,
      status: CaseStatus.NEW,
      createdAt: new Date().toISOString(),
      media: mediaFiles.length > 0 ? mediaFiles : [{ url: 'https://picsum.photos/seed/case/800/600', type: 'image' }]
    };
    onAddCase(newCase);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-6 duration-700 pb-24">
      <button 
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center space-x-3 text-violet-400 hover:text-brand-primary mb-10 transition-all group active:scale-95"
      >
        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-xl">Geri qayıt</span>
      </button>

      <div className="bg-white p-8 sm:p-12 md:p-16 rounded-[40px] sm:rounded-[60px] violet-shadow border border-violet-50">
        <header className="mb-14 text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl font-bold text-brand-ink mb-3 italic leading-tight">Yeni Klinik Keys</h2>
          <p className="text-xl text-brand-ink/40 font-medium">Tibbi uğurlarınızı dünyaya nümayiş etdirin</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-black text-violet-400 uppercase tracking-widest ml-1">Başlıq</label>
              <input 
                required
                type="text" 
                placeholder="Məs: Laparoskopik Kistektomiya"
                className="w-full px-6 py-5 rounded-2xl bg-brand-mist border border-violet-100 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-bold italic text-brand-ink text-lg"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-violet-400 uppercase tracking-widest ml-1">Kateqoriya</label>
              <select 
                className="w-full px-6 py-5 rounded-2xl bg-brand-mist border border-violet-100 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all appearance-none font-bold text-brand-ink italic text-lg"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Ginekologiya</option>
                <option>Pediatriya</option>
                <option>Stomatologiya</option>
                <option>Cərrahiyyə</option>
                <option>Kardiologiya</option>
                <option>Oftalmologiya</option>
                <option>Nevrologiya</option>
              </select>
            </div>
          </div>

          <div className="space-y-5">
            <label className="text-sm font-black text-violet-400 uppercase tracking-widest ml-1">Media (Şəkil/Video)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-violet-100 bg-brand-mist rounded-[40px] p-12 md:p-16 flex flex-col items-center justify-center cursor-pointer hover:bg-violet-50 transition-all group"
            >
              <div className="w-20 h-20 bg-white rounded-3xl shadow-lg shadow-violet-100 flex items-center justify-center text-brand-primary mb-6 group-hover:scale-105 transition-transform">
                <ImageIcon size={40} />
              </div>
              <p className="text-brand-ink font-bold text-xl text-center">Media yükləmək üçün klikləyin</p>
              <p className="text-violet-400 text-sm mt-2 hidden sm:block">Faylları bura sürükləyə də bilərsiniz</p>
              <input 
                type="file" 
                multiple 
                accept="image/*,video/*"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-8">
                {mediaFiles.map((file, idx) => (
                  <div key={idx} className="relative aspect-square rounded-[24px] overflow-hidden border border-violet-100 group shadow-lg">
                    {file.type === 'image' ? (
                      <img src={file.url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full bg-brand-ink flex items-center justify-center">
                        <Video className="text-white" size={32} />
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-3 right-3 p-2 bg-white/95 rounded-xl text-brand-primary shadow-xl hover:scale-110 transition-transform"
                    >
                      <X size={18} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-violet-400 uppercase tracking-widest ml-1">Qısa İzah</label>
            <textarea 
              required
              rows={3}
              placeholder="..."
              className="w-full px-6 py-5 rounded-2xl bg-brand-mist border border-violet-100 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium italic text-brand-ink text-lg"
              value={formData.shortDescription}
              onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-black text-violet-400 uppercase tracking-widest ml-1">Pasiyent Problemi</label>
              <textarea required rows={4} className="w-full px-6 py-5 rounded-2xl bg-brand-mist border border-violet-100 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all text-brand-ink text-lg" value={formData.patientProblem} onChange={(e) => setFormData({...formData, patientProblem: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-violet-400 uppercase tracking-widest ml-1">Müalicə Prosesi</label>
              <textarea required rows={4} className="w-full px-6 py-5 rounded-2xl bg-brand-mist border border-violet-100 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all text-brand-ink text-lg" value={formData.treatmentProcess} onChange={(e) => setFormData({...formData, treatmentProcess: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-violet-400 uppercase tracking-widest ml-1">Nəticə</label>
              <textarea required rows={4} className="w-full px-6 py-5 rounded-2xl bg-brand-mist border border-violet-100 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all text-brand-ink text-lg" value={formData.result} onChange={(e) => setFormData({...formData, result: e.target.value})} />
            </div>
          </div>

          <div className="space-y-5 pt-6">
            <label className="flex items-center space-x-4 cursor-pointer group">
              <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData.isAnonymous ? 'bg-brand-primary border-brand-primary' : 'border-violet-200 group-hover:border-brand-primary'}`}>
                {formData.isAnonymous && <Check size={20} className="text-white" strokeWidth={4} />}
              </div>
              <input type="checkbox" className="hidden" checked={formData.isAnonymous} onChange={() => setFormData({...formData, isAnonymous: !formData.isAnonymous})} />
              <span className="text-lg font-bold text-brand-ink italic">Pasiyent məlumatları anonimdir</span>
            </label>

            <label className="flex items-center space-x-4 cursor-pointer group">
              <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData.isSuitableForSharing ? 'bg-brand-primary border-brand-primary' : 'border-violet-200 group-hover:border-brand-primary'}`}>
                {formData.isSuitableForSharing && <Check size={20} className="text-white" strokeWidth={4} />}
              </div>
              <input type="checkbox" className="hidden" checked={formData.isSuitableForSharing} onChange={() => setFormData({...formData, isSuitableForSharing: !formData.isSuitableForSharing})} />
              <span className="text-lg font-bold text-brand-ink italic">Sosial şəbəkələrdə paylaşıla bilər</span>
            </label>
          </div>

          <div className="pt-12 flex flex-col sm:flex-row gap-6">
            <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-white border-2 border-violet-100 text-violet-300 py-6 rounded-[32px] font-black text-xl hover:bg-violet-50 hover:text-brand-primary transition-all active:scale-95">Ləğv et</button>
            <button type="submit" className="flex-[2] bg-brand-primary text-white py-6 rounded-[32px] font-black text-xl shadow-2xl shadow-violet-200 hover:bg-violet-700 transition-all flex items-center justify-center space-x-4 active:scale-95">
              <Send size={24} strokeWidth={3} />
              <span>Marketinqə Göndər</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCasePage;
