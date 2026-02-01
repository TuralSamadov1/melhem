import { useState, useEffect } from "react";
import { login, getMe, register } from "@/services/auth";

import {
  Sparkles,
  Stethoscope,
  Heart,
  ArrowRight,
  X,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  ChevronRight,
  Mail,
} from "lucide-react";

import { User, UserRole } from "@/types";

interface LandingPageProps {
  onLogin: (user: User) => void;
}


const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.DOCTOR);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setError(null);
  }, [role]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Login
      await login(formData.email, formData.password);

      // 2. User məlumatı
      const me = await getMe();

      // 3. App state
      onLogin(me);

      // 4. Role görə yönləndirmə
      if (me.role === "MARKETING") {
        window.location.href = "/marketing";
      } else if (me.role === "DOCTOR") {
        window.location.href = "/doctor";
      } else {
        setError("İstifadəçi rolu tanınmadı.");
        return;
      }

      setShowAuthModal(false);
    } catch {
      setError("E-poçt və ya parol yanlışdır.");
    }
  };

  const resetModal = () => {
    setShowAuthModal(false);
    setError(null);
  };

  // Əgər user localStorage-da varsa, giriş və qeydiyyat düymələrini göstərmə
  const userExists = typeof window !== 'undefined' && !!localStorage.getItem('access_token');

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

          {!userExists && (
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 pt-6 sm:pt-10">
              <button 
                onClick={() => {
                  setRole(UserRole.DOCTOR);
                  setShowAuthModal(true);
                }}
                className="group flex-1 bg-brand-primary text-white px-8 sm:px-12 py-6 sm:py-8 rounded-[32px] font-bold shadow-2xl shadow-violet-200/50 hover:bg-violet-700 hover:-translate-y-1 transition-all flex items-center justify-center space-x-4 active:scale-95"
              >
                <Stethoscope size={28} className="sm:w-8 sm:h-8" />
                <span className="text-xl sm:text-2xl">Həkim Girişi</span>
                <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all hidden sm:block" />
              </button>
              <button 
                onClick={() => {
                  setRole(UserRole.MARKETING);
                  setShowAuthModal(true);
                }}
                className="flex-1 bg-white border-2 border-violet-100 text-brand-primary px-8 sm:px-12 py-6 sm:py-8 rounded-[32px] font-bold hover:bg-violet-50 hover:-translate-y-1 transition-all flex items-center justify-center space-x-4 active:scale-95 shadow-xl shadow-violet-100/40"
              >
                <Sparkles size={28} className="sm:w-8 sm:h-8" />
                <span className="text-xl sm:text-2xl">Marketinq</span>
              </button>
            </div>
          )}
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
                  Xoş Gəlmisiniz
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

              <form onSubmit={handleAuthSubmit} className="space-y-6">

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">
                    E-poçt
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="mail@hospital.az"
                    className="w-full px-6 py-4 rounded-2xl bg-brand-mist border border-violet-50 focus:border-brand-primary focus:outline-none font-medium text-brand-ink text-sm"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest ml-1">
                    Parol
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-6 py-4 rounded-2xl bg-brand-mist border border-violet-50 focus:border-brand-primary focus:outline-none font-medium text-brand-ink text-sm"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-violet-300 hover:text-brand-primary"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full bg-brand-primary text-white py-6 rounded-2xl font-bold text-xl shadow-2xl shadow-violet-200/60 hover:bg-violet-700 transition-all"
                >
                  Daxil Ol
                </button>

              </form>


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