import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../modules/auth/context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

const AppShell = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout, isAdmin } = useAuth();
    const { isDark } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const allNavigation = [
        // Trainer navigation
        { name: 'My Courses', href: '/courses', icon: BookIcon, roles: ['Trainer'] },
        // Admin navigation
        { name: 'User Management', href: '/admin/users', icon: UsersIcon, roles: ['SuperAdmin', 'Admin'] },
        { name: 'Enrollments', href: '/admin/enrollments', icon: UsersIcon, roles: ['SuperAdmin', 'Admin'] },
        { name: 'Organization', href: '/admin/organization', icon: BuildingIcon, roles: ['SuperAdmin', 'Admin'] },
        // Learner navigation
        { name: 'My Courses', href: '/learner/courses', icon: BookIcon, roles: ['Learner'] },
        // Shared navigation
        { name: "Knowledge Base", href: "/search", icon: BookIcon, roles: ["SuperAdmin", "Admin", "Trainer", "Learner"] },
    ];

    // Filter navigation based on user role
    const navigation = allNavigation.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(user?.role);
    });

    const isActive = (path) => location.pathname === path;

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-slate-50'}`}>
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 overflow-y-auto ${isDark
                        ? 'bg-gray-800 border-r border-gray-700'
                        : 'bg-white border-r border-slate-200'
                    }`}
            >
                {/* Logo */}
                <div className={`h-20 flex items-center px-8 border-b ${isDark ? 'border-gray-700' : 'border-slate-100'}`}>
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-100">
                        <span className="text-white font-bold text-xl">L</span>
                    </div>
                    <div>
                        <span className={`text-xl font-bold leading-none block ${isDark ? 'text-white' : 'text-slate-900'}`}>LMS</span>
                        <span className={`text-xs font-medium tracking-wider uppercase ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Academy</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-6 space-y-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 group ${isActive(item.href)
                                ? isDark
                                    ? 'bg-indigo-900/50 text-indigo-400 shadow-sm'
                                    : 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50'
                                : isDark
                                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 mr-3.5 transition-colors ${isActive(item.href)
                                ? 'text-indigo-500'
                                : isDark
                                    ? 'text-gray-400 group-hover:text-gray-300'
                                    : 'text-slate-400 group-hover:text-slate-600'
                                }`} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : ''}`}>
                {/* Header */}
                <header className={`h-20 backdrop-blur-md border-b sticky top-0 z-30 flex items-center justify-between px-8 ${isDark
                    ? 'bg-gray-800/80 border-gray-700'
                    : 'bg-white/80 border-slate-100'
                    }`}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`p-2.5 rounded-xl transition-colors lg:hidden ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-100 text-slate-600'
                            }`}
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>

                    <div className="flex-1" />

                    {/* User menu */}
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.name}</p>
                            <p className="text-xs font-medium text-indigo-600">{user?.role}</p>
                        </div>
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold border overflow-hidden shadow-sm ${isDark
                            ? 'bg-indigo-900/50 text-indigo-400 border-indigo-800'
                            : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                            }`}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className={`w-px h-6 ${isDark ? 'bg-gray-700' : 'bg-slate-200'}`} />
                        <button
                            onClick={handleLogout}
                            className={`p-2.5 rounded-xl transition-all duration-200 group ${isDark
                                ? 'text-gray-400 hover:text-rose-400 hover:bg-rose-900/30'
                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                }`}
                            title="Logout"
                        >
                            <LogoutIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-8 max-w-7xl mx-auto">
                    <div className="animate-in">
                        {children}
                    </div>
                </main>
                <main className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

// Icon components
const HomeIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const BookIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const BuildingIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const MenuIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const LogoutIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export default AppShell;
