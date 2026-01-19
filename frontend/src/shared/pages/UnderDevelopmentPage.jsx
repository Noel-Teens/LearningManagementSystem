import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { Button } from '../components/common';

const UnderDevelopmentPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header with Logout */}
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-100">
                        <span className="text-white font-bold text-xl">L</span>
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 leading-none block">LMS</span>
                        <span className="text-xs font-medium text-slate-500 tracking-wider uppercase">Academy</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                        <p className="text-xs font-medium text-indigo-600">{user?.role}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 group flex items-center"
                        title="Logout"
                    >
                        <span className="mr-2 text-sm font-medium">Logout</span>
                        <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-md w-full text-center animate-in">
                    <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-50">
                        <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Website Under Development</h1>
                    <p className="text-slate-500 text-lg font-medium mb-8">
                        We're currently building something amazing for our students. Please check back later.
                    </p>
                    <div className="w-16 h-1.5 bg-indigo-600 rounded-full mx-auto" />
                </div>
            </main>
        </div>
    );
};

export default UnderDevelopmentPage;
