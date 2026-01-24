import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../modules/auth/context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";

/* ================= ICONS ================= */
const BookIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13
         C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13
         C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13
         C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1
         a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const BuildingIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5
         M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const MenuIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const LogoutIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6
         a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

/* ================= APPSHELL ================= */
const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const allNavigation = [
    { name: "User Management", href: "/admin/users", icon: UsersIcon, roles: ["SuperAdmin", "Admin"] },
    { name: "Organization", href: "/admin/organization", icon: BuildingIcon, roles: ["SuperAdmin", "Admin"] },
    { name: "Knowledge Base", href: "/search", icon: BookIcon, roles: ["SuperAdmin", "Admin", "Trainer", "Learner"] },
  ];

  const navigation = allNavigation.filter(item =>
    item.roles.some(r => r.toLowerCase() === user?.role?.toLowerCase())
  );

  const isActive = path => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        sidebar-bg border-r rounded-r-3xl`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <div>
            <p className="font-bold text-lg text-indigo-900">LMS</p>
            <p className="text-xs text-indigo-500">Academy</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          {navigation.map(item => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl transition font-medium
                ${
                  isActive(item.href)
                    ? "sidebar-active"
                    : "sidebar-item"
                }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="lg:ml-72">
        <header className="h-20 flex items-center justify-between px-8 border-b bg-white sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <MenuIcon className="w-6 h-6 text-indigo-600" />
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-indigo-600 uppercase">{user?.role}</p>
            </div>

            <button onClick={handleLogout} title="Logout">
              <LogoutIcon className="w-6 h-6 text-rose-500" />
            </button>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppShell;
