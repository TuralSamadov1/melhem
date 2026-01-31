
import React, { useState, useEffect } from 'react';
import { Sparkles, Stethoscope, Activity, Heart, ArrowRight, User as UserIcon, Mail, Phone, Instagram, Globe, Award, ChevronRight, X, Megaphone, Lock, Eye, EyeOff, Key, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { User, UserRole } from '../types';

interface LandingPageProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT';

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('LOGIN');
  const [role, setRole] = useState<UserRole>(UserRole.DOCTOR);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    degree: 'Dr.',
    specialty: '',
    whatsapp: '',
    instagram: '',
    website: ''
  });

  useEffect(() => {
    setError(null);
  }, [authMode, role]);

  const passwordsMatch = formData.password === formData.confirmPassword || authMode !== 'REGISTER';

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const savedUsersRaw = localStorage.getItem('app_registered_users');
    const savedUsers: any[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];

    if (authMode === 'FORGOT') {
      setRecoverySent(true);
      return;
    }

    if (authMode === 'REGISTER') {
      if (!passwordsMatch) {
        setError('Parollar eyni deyil!');
        return;
      }
      if (savedUsers.some(u => u.email === formData.email)) {
        setError('Bu e-poçt ünvanı artıq qeydiyyatdan keçib.');
        return;
      }

      const newUser: User & { password?: string } = {
        id: Math.random().toString(36).substr(2, 9),
        role: role,
        name: `${role === UserRole.DOCTOR ? formData.degree + ' ' : ''}${formData.name}`,
        email: formData.email,
        password: formData.password, 
        degree: role === UserRole.DOCTOR ? formData.degree : undefined,
        specialty: formData.specialty,
        whatsapp: formData.whatsapp,
        instagram: role === UserRole.DOCTOR ? formData.instagram : undefined,
        website: role === UserRole.DOCTOR ? formData.website : undefined,
        casesCount: 0
      };

      savedUsers.push(newUser);
      localStorage.setItem('app_registered_users', JSON.stringify(savedUsers));
      onLogin(newUser);
    } 
    else if (authMode === 'LOGIN') {
      const foundUser = savedUsers.find(u => u.email === formData.email && u.password === formData.password && u.role === role);
      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError('E-poçt, parol və ya seçilmiş rol yanlışdır.');
      }
    }
  };

  const resetModal = () => {
    setShowAuthModal(false);
    setAuthMode('LOGIN');
    setRecoverySent(false);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-brand-mist w-full overflow-hidden font-sans">
      <div className="fixed top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-violet-100/40 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-10">
        <div className="space-y-10 sm:space-y-14 relative text-center lg:text-left">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white rounded-full shadow-lg shadow-violet-50 border border-violet-100 animate-bounce-subtle mx-auto lg:mx-0">
            <Heart size={20} className="text-brand-primary fill-brand-primary" />
            <span className="text-[10px] sm:text-xs font-bold text-brand-primary uppercase tracking-[0.2em] font-display">Məlhəm Beynəlxalq Hospital</span>
          </div>
          
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-brand-ink leading-[1.1] font-serif italic tracking-tight">
              Məlhəm Beynəlxalq <br className="hidden sm:block" /> Hospitalda 
              <span className="text-brand-primary relative block sm:inline-block sm:ml-4">
                həkimlərin keysləri.
                <svg className="absolute -bottom-2 sm:-bottom-4 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 2 150 2 298 10" stroke="#6D28D9" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-brand-ink/60 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
              Klinik təcrübənizi rəqəmsal dünyaya daşıyın, peşəkar uğurlarınızı bizimlə birgə paylaşın.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 pt-6 sm:pt-10">
            <button 
              onClick={() => { setRole(UserRole.DOCTOR); setShowAuthModal(true); setAuthMode('LOGIN'); }}
              className="group flex-1 bg-brand-primary text-white px-8 sm:px-12 py-6 sm:py-8 rounded-[32px] font-bold shadow-2xl shadow-violet-200/50 hover:bg-violet-700 hover:-translate-y-1 transition-all flex items-center justify-center space-x-4 active:scale-95"
            >
              <Stethoscope size={28} className="sm:w-8 sm:h-8" />
              <span className="text-xl sm:text-2xl">Həkim Girişi</span>
              <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all hidden sm:block" />
            </button>
            <button 
              onClick={() => { setRole(UserRole.MARKETING); setShowAuthModal(true); setAuthMode('LOGIN'); }}
              className="flex-1 bg-white border-2 border-violet-100 text-brand-primary px-8 sm:px-12 py-6 sm:py-8 rounded-[32px] font-bold hover:bg-violet-50 hover:-translate-y-1 transition-all flex items-center justify-center space-x-4 active:scale-95 shadow-xl shadow-violet-100/40"
            >
              <Sparkles size={28} className="sm:w-8 sm:h-8" />
              <span className="text-xl sm:text-2xl">Marketinq</span>
            </button>
          </div>
        </div>

        <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-200">
           <div className="relative z-10">
            <div className="absolute -inset-6 bg-violet-200/20 rounded-[70px] blur-3xl -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=1000&auto=format&fit=crop" 
              alt="Premium Hospital Environment" 
              className="rounded-[60px] shadow-3xl border-[12px] border-white object-cover aspect-[4/5] violet-shadow"
            />
          </div>
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-brand-ink/30 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500 max-h-[95vh] flex flex-col border border-violet-50">
            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-brand-ink font-display italic">
                  {authMode === 'LOGIN' ? 'Xoş Gəlmisiniz' : authMode === 'REGISTER' ? 'Qeydiyyat' : 'Bərpa'}
                </h3>
                <button onClick={resetModal} className="p-2.5 bg-brand-mist rounded-xl text-violet-300 hover:text-brand-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 animate-in shake duration-300">
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {recoverySent ? (
                <div className="py-12 text-center space-y-8 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-brand-lavender rounded-full flex items-center justify-center text-brand-primary mx-auto shadow-inner">
                    <Mail size={32} />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-brand-ink">E-poçt Göndərildi!</h4>
                    <p className="text-brand-ink/60 font-medium px-10 text-sm">
                      Təlimatları daxil etdiyiniz <b>{formData.email}</b> ünvanına göndərdik.
                    </p>
                  </div>
                  <button onClick={() => { setRecoverySent(false); setAuthMode('LOGIN'); }} className="flex items-center space-x-2 mx-auto text-brand-primary font-bold hover:underline text-sm">
                    <ArrowLeft size={16} />
                    <span>Geri qayıt</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="space-y-6">
                  <div className="flex p-1.5 bg-brand-mist rounded-2xl border border-violet-50 shadow-inner">
                    <button 
                      type="button"
                      onClick={() => setRole(UserRole.DOCTOR)}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${role === UserRole.DOCTOR ? 'bg-white text-brand-primary shadow-md' : 'text-violet-300 hover:text-brand-primary'}`}
                    >
                      Həkim
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole(UserRole.MARKETING)}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${role === UserRole.MARKETING ? 'bg-white text-brand-primary shadow-md' : 'text-violet-300 hover:text-brand-primary'}`}
                    >
                      Marketinq
                    </button>
                  </div>

                  <div className="space-y-4">
                    {authMode === 'REGISTER' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {role === UserRole.DOCTOR && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">Dərəcə</label>
                            <select 
                              className="w-full pl-6 pr-6 py-4 rounded-2xl bg-brand-mist border border-violet-50 focus:border-brand-primary focus:outline-none font-medium text-brand-ink appearance-none text-sm"
                              value={formData.degree}
                              onChange={(e) => setFormData({...formData, degree: e.target.value})}
                            >
                              <option>Dr.</option><option>PhD</option><option>op.PhD</option><option>Uzman</option><option>Prof.</option><option>Dos.</option>
                            </select>
                          </div>
                        )}
                        <div className={`${role === UserRole.DOCTOR ? '' : 'md:col-span-2'} space-y-1.5`}>
                          <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">Ad Soyad</label>
                          <input required type="text" placeholder="Ad və Soyad" className="w-full px-6 py-4 rounded-2xl bg-brand-mist border border-violet-50 focus:border-brand-primary focus:outline-none font-medium text-brand-ink text-sm shadow-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">İxtisas / Sahə</label>
                          <input required type="text" placeholder={role === UserRole.DOCTOR ? "Məs: Ginekologiya" : "Məs: Rəqəmsal Marketinq"} className="w-full px-6 py-4 rounded-2xl bg-brand-mist border border-violet-50 focus:border-brand-primary focus:outline-none font-medium text-brand-ink text-sm shadow-sm" value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">E-poçt</label>
                      <input required type="email" placeholder="mail@hospital.az" className="w-full px-6 py-4 rounded-2xl bg-brand-mist border border-violet-50 focus:border-brand-primary focus:outline-none font-medium text-brand-ink text-sm shadow-sm" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>

                    {authMode !== 'FORGOT' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${authMode === 'REGISTER' ? 'md:col-span-1' : 'md:col-span-2'} space-y-1.5`}>
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Parol</label>
                            {authMode === 'LOGIN' && <button type="button" onClick={() => setAuthMode('FORGOT')} className="text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-tight">Unutmusunuz?</button>}
                          </div>
                          <div className="relative">
                            <input required type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full px-6 py-4 rounded-2xl bg-brand-mist border border-violet-50 focus:border-brand-primary focus:outline-none font-medium text-brand-ink text-sm shadow-sm" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-violet-300 hover:text-brand-primary">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                          </div>
                        </div>
                        {authMode === 'REGISTER' && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">Təsdiq</label>
                            <input required type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className={`w-full px-6 py-4 rounded-2xl bg-brand-mist border font-medium text-brand-ink text-sm focus:outline-none shadow-sm ${!passwordsMatch && formData.confirmPassword ? 'border-red-500' : 'border-violet-50 focus:border-brand-primary'}`} value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                          </div>
                        )}
                      </div>
                    )}

                    {authMode === 'REGISTER' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">WhatsApp</label>
                          <input required type="tel" placeholder="+994 (__) ___-__-__" className="w-full px-6 py-4 rounded-2xl bg-brand-mist border border-violet-50 focus:border-brand-primary focus:outline-none font-medium text-brand-ink text-sm shadow-sm" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
                        </div>
                        {role === UserRole.DOCTOR && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">Instagram (@)</label>
                            <input type="text" placeholder="İstifadəçi adı" className="w-full px-6 py-4 rounded-2xl bg-brand-mist border border-violet-50 focus:border-brand-primary focus:outline-none font-medium text-brand-ink text-sm shadow-sm" value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={authMode === 'REGISTER' && !passwordsMatch} className={`w-full bg-brand-primary text-white py-6 rounded-2xl font-bold text-xl shadow-2xl shadow-violet-200/60 hover:bg-violet-700 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-3 active:scale-95 mt-6 ${authMode === 'REGISTER' && !passwordsMatch ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span>{authMode === 'LOGIN' ? 'Daxil Olun' : authMode === 'REGISTER' ? 'Qeydiyyatı Tamamla' : 'Bərpa Et'}</span>
                    <ChevronRight size={24} />
                  </button>

                  <div className="text-center pt-6">
                    <button type="button" onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="text-base font-bold text-violet-400 hover:text-brand-primary transition-colors">
                      {authMode === 'LOGIN' ? 'Hesabınız yoxdur? Qeydiyyatdan keçin' : 'Artıq hesabınız var? Daxil olun'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
        .animate-in.shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default LandingPage;
