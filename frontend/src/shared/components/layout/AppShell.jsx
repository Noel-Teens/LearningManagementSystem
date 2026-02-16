import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../modules/auth/context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import * as notificationService from '../../../services/notificationService';

const AppShell = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout, isAdmin } = useAuth();
    const { isDark } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    // Notification State
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        if (user?._id) {
            fetchNotifications();
            // Poll every 10 seconds for new notifications
            const interval = setInterval(fetchNotifications, 10000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            if (!user?._id) return;
            const data = await notificationService.getNotifications(user._id);
            setNotifications(data || []);
            const unread = (data || []).filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    const handleMarkAsRead = async () => {
        try {
            await notificationService.markAsRead(user._id);
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error("Failed to mark read", err);
        }
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications && unreadCount > 0) {
            handleMarkAsRead();
        }
    };

    const allNavigation = [
        // Trainer navigation
        { name: 'My Courses', href: '/courses', icon: BookIcon, roles: ['Trainer'] },
        { name: 'Analytics', href: '/trainer/analytics', icon: ChartIcon, roles: ['Trainer'] },
        // Admin navigation
        { name: 'User Management', href: '/admin/users', icon: UsersIcon, roles: ['SuperAdmin', 'Admin'] },
        { name: 'Enrollments', href: '/admin/enrollments', icon: UsersIcon, roles: ['SuperAdmin', 'Admin'] },
        { name: 'Reports', href: '/admin/reports', icon: ChartIcon, roles: ['SuperAdmin', 'Admin'] },
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
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={toggleNotifications}
                                className={`p-2.5 rounded-xl transition-colors relative ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-100 text-slate-500'}`}
                                title="Notifications"
                            >
                                <BellIcon className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
                                )}
                            </button>

                            {/* Dropdown */}
                            {showNotifications && (
                                <div className={`absolute right-0 mt-4 w-96 rounded-2xl shadow-xl border z-50 overflow-hidden backdrop-blur-md ${isDark
                                    ? 'bg-gray-800/90 border-gray-700'
                                    : 'bg-white/90 border-slate-100'
                                    }`}>
                                    <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
                                        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
                                        <button
                                            onClick={handleMarkAsRead}
                                            className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
                                        >
                                            Mark all as read
                                        </button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className={`p-8 text-center text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-slate-100'}`}>
                                                    <BellIcon className="w-6 h-6 opacity-50" />
                                                </div>
                                                <p>No notifications yet</p>
                                            </div>
                                        ) : (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif._id}
                                                    className={`p-4 border-b last:border-0 transition-colors ${!notif.isRead
                                                        ? isDark ? 'bg-indigo-900/20' : 'bg-indigo-50/50'
                                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                        } ${isDark ? 'border-gray-700' : 'border-slate-100'}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-indigo-500' : 'bg-transparent'}`} />
                                                        <div>
                                                            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                                                                {notif.title}
                                                            </p>
                                                            <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                                                {notif.message}
                                                            </p>
                                                            <p className={`text-[10px] mt-2 font-medium ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                                                {new Date(notif.createdAt).toLocaleDateString(undefined, {
                                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

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

const ChartIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

const BellIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

export default AppShell;
