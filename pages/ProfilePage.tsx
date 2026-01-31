
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Mail, Phone, MapPin, Edit2, ChevronLeft, Save, LogOut, Copy, Check, ExternalLink, Globe, Instagram, Award, Megaphone, ShieldCheck, Lock, Eye, EyeOff, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfilePageProps {
  user: User;
  setUser: (user: User) => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setUser, onLogout }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editingSections, setEditingSections] = useState({
    professional: false,
    contact: false,
    security: false
  });

  const [editedUser, setEditedUser] = useState({
    name: user.name,
    specialty: user.specialty || '',
    degree: user.degree || 'Dr.',
    whatsapp: user.whatsapp || '',
    instagram: user.instagram || '',
    website: user.website || '',
    profileImage: 'https://picsum.photos/seed/profile/400/400'
  });

  const [passwordState, setPasswordState] = useState({
    newPassword: '',
    confirmPassword: '',
    showNew: false,
    showConfirm: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const toggleSection = (section: keyof typeof editingSections) => {
    setEditingSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditedUser(prev => ({ ...prev, profileImage: url }));
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setUser({
        ...user,
        name: editedUser.name,
        specialty: editedUser.specialty,
        degree: editedUser.degree,
        whatsapp: editedUser.whatsapp,
        instagram: user.role === UserRole.DOCTOR ? editedUser.instagram : undefined,
        website: user.role === UserRole.DOCTOR ? editedUser.website : undefined
      });
      setIsSaving(false);
      setEditingSections({ professional: false, contact: false, security: false });
    }, 800);
  };

  const publicProfileLink = `https://melhem.az/dr/${user.id || 'username'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicProfileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const passwordsMatch = passwordState.newPassword === passwordState.confirmPassword;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-700 pb-24 md:pb-12 text-brand-ink">
      <div className="flex flex-col space-y-4">
        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center space-x-2 text-violet-400 hover:text-brand-primary transition-all group active:scale-95 w-fit p-1 -ml-1">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-lg">Geri qayıt</span>
        </button>
        <h2 className="text-3xl md:text-4xl font-bold font-serif italic">Profil Parametrləri</h2>
      </div>

      <div className="bg-white p-8 md:p-14 rounded-[40px] border border-violet-50 shadow-sm violet-shadow">
        <div className="flex flex-col items-center mb-14">
          <div className="relative group">
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-brand-lavender shadow-xl bg-brand-mist flex items-center justify-center">
              <img src={editedUser.profileImage} alt="Profil" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-white text-brand-primary p-2.5 rounded-full shadow-lg border border-violet-100 hover:scale-110 active:scale-90 transition-all">
              <Edit2 size={16} strokeWidth={2.5} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mt-6 font-display italic text-center">{editedUser.name}</h3>
          <p className="text-violet-500 font-semibold text-base md:text-lg mt-1 text-center">{editedUser.specialty || (user.role === UserRole.MARKETING ? 'Marketinq Mütəxəssisi' : 'Hospital Həkimi')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <SectionHeader icon={<Award size={18} />} title="Peşəkar Məlumatlar" isEditing={editingSections.professional} onToggle={() => toggleSection('professional')} />
          
          {user.role === UserRole.DOCTOR && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">Dərəcə</label>
              <select disabled={!editingSections.professional} className="w-full px-6 py-3.5 rounded-2xl border bg-brand-mist/30 border-violet-50 focus:border-brand-primary focus:outline-none text-base font-medium appearance-none disabled:opacity-60" value={editedUser.degree} onChange={(e) => setEditedUser({...editedUser, degree: e.target.value})}>
                <option>Dr.</option><option>PhD</option><option>op.PhD</option><option>Uzman</option><option>Prof.</option><option>Dos.</option>
              </select>
            </div>
          )}

          <InputGroup label="Tam Ad" value={editedUser.name} readOnly={!editingSections.professional} onChange={(val: string) => setEditedUser({...editedUser, name: val})} />
          <InputGroup label={user.role === UserRole.DOCTOR ? "İxtisas" : "Fəaliyyət Sahəsi"} value={editedUser.specialty} readOnly={!editingSections.professional} onChange={(val: string) => setEditedUser({...editedUser, specialty: val})} />
          <InputGroup label="E-poçt (Dəyişməz)" value={user.email} readOnly />

          <SectionHeader icon={<Phone size={18} />} title="Əlaqə və Sosial Media" isEditing={editingSections.contact} onToggle={() => toggleSection('contact')} className="md:col-span-2 mt-8" />
          
          <InputGroup label="WhatsApp" value={editedUser.whatsapp} readOnly={!editingSections.contact} onChange={(val: string) => setEditedUser({...editedUser, whatsapp: val})} />
          {user.role === UserRole.DOCTOR && (
            <>
              <InputGroup label="Instagram" value={editedUser.instagram} readOnly={!editingSections.contact} onChange={(val: string) => setEditedUser({...editedUser, instagram: val})} />
              <InputGroup label="Vebsayt" value={editedUser.website} readOnly={!editingSections.contact} onChange={(val: string) => setEditedUser({...editedUser, website: val})} />
            </>
          )}

          <SectionHeader icon={<ShieldCheck size={18} />} title="Təhlükəsizlik" isEditing={editingSections.security} onToggle={() => toggleSection('security')} className="md:col-span-2 mt-8" />

          {editingSections.security && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-brand-mist rounded-3xl border border-violet-50 animate-in zoom-in duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">Yeni Parol</label>
                <div className="relative">
                  <input type={passwordState.showNew ? "text" : "password"} className="w-full px-6 py-3.5 rounded-2xl border border-violet-100 focus:border-brand-primary outline-none font-medium text-sm" placeholder="••••••••" value={passwordState.newPassword} onChange={(e) => setPasswordState({...passwordState, newPassword: e.target.value})} />
                  <button type="button" onClick={() => setPasswordState({...passwordState, showNew: !passwordState.showNew})} className="absolute right-5 top-1/2 -translate-y-1/2 text-violet-300">{passwordState.showNew ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">Təsdiq</label>
                <input type={passwordState.showConfirm ? "text" : "password"} className={`w-full px-6 py-3.5 rounded-2xl border outline-none font-medium text-sm ${!passwordsMatch && passwordState.confirmPassword ? 'border-red-500' : 'border-violet-100 focus:border-brand-primary'}`} value={passwordState.confirmPassword} onChange={(e) => setPasswordState({...passwordState, confirmPassword: e.target.value})} />
              </div>
            </div>
          )}

          {user.role === UserRole.DOCTOR && (
            <div className="md:col-span-2 space-y-4 pt-10 border-t border-violet-50">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">İctimai Profil Linki</label>
                <div className="bg-emerald-50 px-3 py-1 rounded-full text-[9px] font-bold text-emerald-600 border border-emerald-100 uppercase tracking-widest">İnternetdə Aktiv</div>
              </div>
              <div className="relative flex items-center bg-brand-mist border border-brand-lavender rounded-2xl p-2 pr-4 shadow-sm">
                <div className="flex-1 px-4 py-2 font-medium text-sm truncate opacity-70">{publicProfileLink}</div>
                <div className="flex items-center space-x-1">
                  <a href={publicProfileLink} target="_blank" rel="noopener noreferrer" className="p-2.5 text-violet-300 hover:text-brand-primary transition-colors"><ExternalLink size={18} /></a>
                  <button onClick={copyToClipboard} className={`p-2.5 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white shadow-md' : 'text-brand-primary hover:bg-white'}`}>{copied ? <Check size={18} /> : <Copy size={18} />}</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-violet-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button onClick={handleLogout} className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-3.5 rounded-2xl font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-all active:scale-95 group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Çıxış</span>
          </button>
          {(editingSections.professional || editingSections.contact || editingSections.security) && (
            <button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto bg-brand-primary text-white px-10 py-3.5 rounded-2xl font-semibold shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center space-x-3 active:scale-95">
              {isSaving ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={20} />}
              <span>Yadda Saxla</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon, title, isEditing, onToggle, className = "" }: any) => (
  <div className={`md:col-span-2 flex items-center justify-between border-b border-violet-50 pb-3 ${className}`}>
    <h4 className="text-lg font-bold font-display italic flex items-center">
      <div className="w-8 h-8 bg-brand-lavender rounded-lg flex items-center justify-center text-brand-primary mr-3">{icon}</div>
      {title}
    </h4>
    <button onClick={onToggle} className={`p-2 rounded-lg transition-all ${isEditing ? 'bg-brand-primary text-white shadow-md' : 'bg-brand-mist text-violet-300 hover:text-brand-primary'}`}>
      <Edit2 size={16} />
    </button>
  </div>
);

const InputGroup = ({ label, value, onChange, readOnly = false }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type="text" 
      value={value} 
      readOnly={readOnly} 
      onChange={(e) => onChange && onChange(e.target.value)} 
      className={`w-full px-6 py-3.5 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-brand-primary/5 text-base font-medium ${readOnly ? 'bg-brand-mist/30 border-violet-50 cursor-not-allowed text-violet-400' : 'bg-white border-violet-100 focus:border-brand-primary text-brand-ink'}`} 
    />
  </div>
);

export default ProfilePage;
