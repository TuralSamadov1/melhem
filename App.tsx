
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  PlusCircle, 
  LayoutDashboard, 
  FileText, 
  BarChart2, 
  User as UserIcon, 
  LogOut,
  Menu,
  X,
  Activity,
  Award,
  Plus,
  Bell,
  Check
} from 'lucide-react';
import { ClinicalCase, User, UserRole, Notification, CaseStatus } from './types';
import { INITIAL_CASES, MOCK_DOCTOR, MOCK_MARKETING } from './constants';
import LandingPage from './pages/LandingPage';
import DoctorDashboard from './pages/DoctorDashboard';
import NewCasePage from './pages/NewCasePage';
import MarketingDashboard from './pages/MarketingDashboard';
import CaseDetailPage from './pages/CaseDetailPage';
import MyCasesPage from './pages/MyCasesPage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';
import BadgesPage from './pages/BadgesPage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [cases, setCases] = useState<ClinicalCase[]>(() => {
    const saved = localStorage.getItem('cases');
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Handle outside click for notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setShowNotifDropdown(false);
  };

  const addCase = (newCase: ClinicalCase) => {
    setCases([newCase, ...cases]);
    
    // Notify Marketing
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      recipientId: 'MARKETING_TEAM',
      title: 'Yeni Keys Əlavə Edildi',
      message: `${newCase.doctorName} tərəfindən yeni klinik keys təqdim olundu: "${newCase.title}"`,
      createdAt: new Date().toISOString(),
      isRead: false,
      caseId: newCase.id,
      type: 'NEW_SUBMISSION'
    };
    setNotifications([notification, ...notifications]);
  };

  const updateCase = (updatedCase: ClinicalCase) => {
    const oldCase = cases.find(c => c.id === updatedCase.id);
    setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));

    // If status changed, notify the doctor
    if (oldCase && oldCase.status !== updatedCase.status) {
      const notification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        recipientId: updatedCase.doctorId,
        title: 'Keys Statusu Dəyişdi',
        message: `"${updatedCase.title}" keysinin statusu "${updatedCase.status}" olaraq yeniləndi.`,
        createdAt: new Date().toISOString(),
        isRead: false,
        caseId: updatedCase.id,
        type: 'STATUS_CHANGE'
      };
      setNotifications([notification, ...notifications]);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(n => 
    user?.role === UserRole.MARKETING ? n.recipientId === 'MARKETING_TEAM' : n.recipientId === user?.id
  );

  const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

  return (
    <HashRouter>
      <div className="min-h-screen bg-brand-mist text-brand-ink selection:bg-violet-100 selection:text-violet-900 flex flex-col md:flex-row">
        {!user ? (
          <LandingPage onLogin={handleLogin} />
        ) : (
          <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex sticky top-0 left-0 z-50 h-screen w-80 bg-white border-r border-violet-50 p-8 flex-col shrink-0">
              <div className="mb-12 flex items-center justify-between shrink-0">
                <Link to="/dashboard" className="group block active:scale-[0.98]">
                  <h1 className="text-4xl font-bold text-brand-primary tracking-tight italic group-hover:tracking-wider transition-all">Məlhəm</h1>
                  <p className="text-xs text-violet-400 font-bold uppercase tracking-[0.2em] mt-1">Content Hub</p>
                </Link>
                
                {/* Notification Bell Desktop */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    className="p-3 bg-brand-lavender/40 text-brand-primary rounded-2xl hover:bg-brand-lavender transition-all relative active:scale-90"
                  >
                    <Bell size={22} strokeWidth={2.5} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showNotifDropdown && (
                    <div className="absolute left-full ml-4 top-0 w-80 bg-white rounded-3xl border border-violet-50 shadow-2xl z-[100] overflow-hidden animate-in slide-in-from-left-2 fade-in duration-200">
                      <div className="p-5 border-b border-violet-50 flex items-center justify-between bg-brand-mist/50">
                        <h4 className="font-black text-brand-ink italic">Bildirişlər</h4>
                        <button 
                          onClick={markAllAsRead}
                          className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline"
                        >
                          Hamısını oxu
                        </button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {filteredNotifications.length > 0 ? (
                          filteredNotifications.map((n) => (
                            <Link 
                              key={n.id}
                              to={`/case/${n.caseId}`}
                              onClick={() => {
                                setNotifications(notifications.map(notif => notif.id === n.id ? { ...notif, isRead: true } : notif));
                                setShowNotifDropdown(false);
                              }}
                              className={`block p-5 border-b border-violet-50 hover:bg-brand-mist transition-colors group ${!n.isRead ? 'bg-violet-50/30' : ''}`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${n.type === 'NEW_SUBMISSION' ? 'text-brand-primary' : 'text-emerald-500'}`}>
                                  {n.title}
                                </span>
                                <span className="text-[9px] text-violet-300 font-bold">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-sm font-medium text-brand-ink/70 leading-relaxed group-hover:text-brand-ink">
                                {n.message}
                              </p>
                            </Link>
                          ))
                        ) : (
                          <div className="p-10 text-center">
                            <Check size={32} className="mx-auto text-violet-100 mb-3" />
                            <p className="text-sm font-bold text-violet-300 italic">Bildiriş yoxdur</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                {user.role === UserRole.DOCTOR ? (
                  <>
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="Əsas Panel" />
                    <SidebarLink to="/new-case" icon={<PlusCircle />} label="Yeni Keys" />
                    <SidebarLink to="/my-cases" icon={<FileText />} label="Keyslərim" />
                    <SidebarLink to="/badges" icon={<Award />} label="Nailiyyətlər" />
                    <SidebarLink to="/stats" icon={<BarChart2 />} label="Statistika" />
                  </>
                ) : (
                  <>
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="Gələn Keyslər" />
                    <SidebarLink to="/stats" icon={<BarChart2 />} label="Performans" />
                  </>
                )}
                
                <div className="pt-8 mt-8 border-t border-violet-50 space-y-3">
                  <SidebarLink to="/profile" icon={<UserIcon />} label="Profil" />
                  <button 
                    onClick={logout}
                    className="flex items-center space-x-4 w-full p-4 text-violet-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl group"
                  >
                    <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-lg">Çıxış</span>
                  </button>
                </div>
              </nav>

              <div className="mt-8 p-6 bg-brand-lavender/50 rounded-[32px] border border-violet-100 violet-shadow shrink-0">
                <p className="text-xs text-brand-primary font-black uppercase tracking-[0.15em] mb-2 opacity-60">Xoş gəldiniz</p>
                <p className="font-bold text-brand-ink truncate italic text-xl">{user.name}</p>
                <p className="text-sm text-violet-500 font-bold mt-0.5 truncate">{user.specialty || (user.role === UserRole.MARKETING ? 'Marketing Team' : 'Hospital Həkimi')}</p>
              </div>
            </aside>

            {/* Mobile Bottom Navigation (App-style) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-violet-100 z-50 px-2 pb-safe shadow-[0_-10px_30px_-15px_rgba(109,40,217,0.1)]">
              <nav className="flex items-center justify-around h-24">
                <MobileNavLink to="/dashboard" icon={<LayoutDashboard size={28} />} label="Əsas" />
                
                {/* Mobile Notification Button */}
                <button 
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className={`flex flex-col items-center justify-center space-y-1.5 w-16 transition-all relative ${showNotifDropdown ? 'text-brand-primary' : 'text-violet-300'}`}
                >
                  <div className="relative">
                    <Bell size={28} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${showNotifDropdown ? 'opacity-100' : 'opacity-60'}`}>Bildiriş</span>
                </button>

                {user.role === UserRole.DOCTOR && (
                  <Link 
                    to="/new-case" 
                    className="flex items-center justify-center -translate-y-10 bg-brand-primary text-white w-16 h-16 rounded-2xl shadow-xl shadow-violet-200 border-4 border-white active:scale-90 transition-all"
                  >
                    <Plus size={34} strokeWidth={3} />
                  </Link>
                )}
                
                <MobileNavLink to="/stats" icon={<BarChart2 size={28} />} label="Stat" isHidden={user.role !== UserRole.DOCTOR} />
                <MobileNavLink to="/profile" icon={<UserIcon size={28} />} label="Profil" />
              </nav>
            </div>

            {/* Mobile Notification Overlay */}
            {showNotifDropdown && (
              <div className="md:hidden fixed inset-0 bg-brand-ink/20 backdrop-blur-sm z-[60] flex items-end animate-in fade-in duration-300">
                <div className="w-full bg-white rounded-t-[40px] p-8 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-brand-ink italic">Bildirişlər</h3>
                    <div className="flex items-center space-x-4">
                       <button onClick={markAllAsRead} className="text-xs font-black text-brand-primary uppercase tracking-widest">Mark read</button>
                       <button onClick={() => setShowNotifDropdown(false)} className="p-2 bg-brand-mist rounded-xl text-violet-400"><X size={20}/></button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((n) => (
                        <Link 
                          key={n.id}
                          to={`/case/${n.caseId}`}
                          onClick={() => {
                            setNotifications(notifications.map(notif => notif.id === n.id ? { ...notif, isRead: true } : notif));
                            setShowNotifDropdown(false);
                          }}
                          className={`block p-6 rounded-3xl border border-violet-50 transition-colors ${!n.isRead ? 'bg-violet-50/50' : 'bg-white'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${n.type === 'NEW_SUBMISSION' ? 'text-brand-primary' : 'text-emerald-500'}`}>
                              {n.title}
                            </span>
                            <span className="text-[10px] text-violet-300 font-bold">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-base font-medium text-brand-ink/80 leading-relaxed">
                            {n.message}
                          </p>
                        </Link>
                      ))
                    ) : (
                      <div className="py-20 text-center">
                        <Check size={48} className="mx-auto text-violet-100 mb-4" />
                        <p className="text-lg font-bold text-violet-300 italic">Heç bir bildiriş yoxdur</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden p-6 md:p-12 lg:p-16 pb-32 md:pb-16">
              <Routes>
                <Route path="/dashboard" element={
                  user.role === UserRole.DOCTOR ? 
                  <DoctorDashboard cases={cases.filter(c => c.doctorId === user.id)} user={user} /> :
                  <MarketingDashboard cases={cases} />
                } />
                <Route path="/new-case" element={<NewCasePage user={user} onAddCase={addCase} />} />
                <Route path="/my-cases" element={<MyCasesPage cases={cases.filter(c => c.doctorId === user.id)} />} />
                <Route path="/stats" element={<StatsPage cases={cases} user={user} />} />
                <Route path="/badges" element={<BadgesPage user={user} />} />
                <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} onLogout={logout} />} />
                <Route path="/case/:id" element={<CaseDetailPage cases={cases} user={user} onUpdateCase={updateCase} />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </>
        )}
      </div>
    </HashRouter>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`
        flex items-center space-x-4 p-4 transition-all rounded-2xl group relative
        ${isActive 
          ? 'bg-brand-primary text-white shadow-xl shadow-violet-100' 
          : 'text-violet-400 hover:text-brand-primary hover:bg-brand-lavender'
        }
      `}
    >
      <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: isActive ? 2.5 : 2 })}
      </div>
      <span className={`font-bold text-lg tracking-tight ${isActive ? 'opacity-100' : 'opacity-80'}`}>
        {label}
      </span>
      {isActive && (
        <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
      )}
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isHidden?: boolean;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, icon, label, isHidden }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (isHidden) return null;

  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center space-y-1.5 w-16 transition-all ${isActive ? 'text-brand-primary' : 'text-violet-300'}`}
    >
      <div className={`${isActive ? 'scale-110' : ''} transition-transform duration-200`}>
        {icon}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
        {label}
      </span>
    </Link>
  );
};

export default App;
