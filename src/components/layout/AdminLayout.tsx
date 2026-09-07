import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/auth.types';
import {
  LayoutDashboard,
  Home,
  Users,
  UserCheck,
  Building2,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  ClipboardList,
  Smile,
  BarChart3,
  Globe,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavGroup {
  label: string;
  items: {
    label: string;
    path: string;
    icon?: React.ReactNode;
  }[];
}

export const AdminLayout: React.FC = () => {
  const { user, role, conferenceContext, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Home: true,
    Speakers: true,
    Partners: true,
    Registrations: true,
    WorkUpdates: true,
  });

  const toggleGroup = (groupLabel: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupLabel]: !prev[groupLabel] }));
  };

  const isMasterAdmin = role === Role.MASTER_ADMIN;

  const navGroups: NavGroup[] = isMasterAdmin
    ? [
        {
          label: 'Master Admin',
          items: [
            { label: 'Master Conferences', path: '/master/conferences', icon: <Globe className="w-4 h-4" /> },
          ],
        },
      ]
    : [
        {
          label: 'Main',
          items: [{ label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }],
        },
        {
          label: 'Home',
          items: [
            { label: 'About Conference', path: '/home/about', icon: <Home className="w-4 h-4" /> },
            { label: 'Important Dates', path: '/home/important-dates' },
            { label: 'Tracks', path: '/home/tracks' },
            { label: 'Attendees From', path: '/home/attendees-from' },
            { label: 'Workshop Banners', path: '/home/workshops' },
          ],
        },
        {
          label: 'Committee & Speakers',
          items: [
            { label: 'Core Committee', path: '/committee', icon: <Users className="w-4 h-4" /> },
            { label: 'All Speakers', path: '/speakers', icon: <UserCheck className="w-4 h-4" /> },
            { label: 'Signed Up Speakers', path: '/speakers?category=SIGNED_UP' },
            { label: 'Plenary Speakers', path: '/speakers?category=PLENARY' },
            { label: 'Keynote Speakers', path: '/speakers?category=KEYNOTE' },
            { label: 'Invited Speakers', path: '/speakers?category=INVITED' },
            { label: 'YRF Speakers', path: '/speakers?category=YRF' },
            { label: 'Featured Speakers', path: '/speakers?category=FEATURED' },
            { label: 'Delegate Speakers', path: '/speakers?category=DELEGATE' },
            { label: 'Poster Speakers', path: '/speakers?category=POSTER' },
            { label: 'Unable to Attend', path: '/speakers?category=UNABLE_TO_ATTEND' },
          ],
        },
        {
          label: 'Partners & Files',
          items: [
            { label: 'Sponsors', path: '/partners/sponsors', icon: <Building2 className="w-4 h-4" /> },
            { label: 'Media Partners', path: '/partners/media' },
            { label: 'Upload PDFs & Files', path: '/files', icon: <FolderOpen className="w-4 h-4" /> },
          ],
        },
        {
          label: 'Registrations & Abstracts',
          items: [
            { label: 'View Registrations', path: '/registrations', icon: <FileText className="w-4 h-4" /> },
            { label: 'View Abstracts', path: '/abstracts', icon: <FileSpreadsheet className="w-4 h-4" /> },
            { label: 'Generate Payment Link', path: '/payments/generate-link', icon: <CreditCard className="w-4 h-4" /> },
          ],
        },
        {
          label: 'Financials',
          items: [
            { label: 'Invoices', path: '/invoices', icon: <Receipt className="w-4 h-4" /> },
            { label: 'Receipts', path: '/receipts' },
          ],
        },
        {
          label: 'Work Updates & Reports',
          items: [
            { label: 'Work Reports', path: '/work-reports', icon: <ClipboardList className="w-4 h-4" /> },
            { label: 'Positives', path: '/positives', icon: <Smile className="w-4 h-4" /> },
            { label: 'Conference Reports', path: '/reports', icon: <BarChart3 className="w-4 h-4" /> },
          ],
        },
      ];

  const handleLogout = () => {
    const wasMaster = isMasterAdmin;
    logout();
    navigate(wasMaster ? '/login' : '/conference-login', { replace: true });
  };

  const renderSidebar = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          C
        </div>
        <div className="overflow-hidden">
          <h1 className="font-bold text-white text-sm tracking-tight truncate">CMS Admin Panel</h1>
          <p className="text-xs text-slate-400 truncate">Conference Management</p>
        </div>
      </div>

      {/* Active Conference Context Card */}
      {conferenceContext && (
        <div className="mx-3 mt-3 p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-lg">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
            Active Conference
          </p>
          <p className="text-xs font-bold text-white mt-0.5 truncate">{conferenceContext.shortName}</p>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.label] ?? true;
          return (
            <div key={group.label} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
              >
                <span>{group.label}</span>
                {group.items.length > 1 &&
                  (isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
              </button>
              {isOpen && (
                <div className="space-y-0.5 pl-1">
                  {group.items.map((item) => {
                    const active = location.pathname + location.search === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={clsx(
                          'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                          active
                            ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        )}
                      >
                        {item.icon || <div className="w-4 h-4 border-l-2 border-slate-700 ml-1" />}
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="overflow-hidden pr-2">
          <p className="text-xs font-semibold text-white truncate">{user?.username || 'Admin User'}</p>
          <p className="text-[10px] text-indigo-400 font-medium truncate">{user?.role || role}</p>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-600/80 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col h-full">{renderSidebar()}</aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex flex-col h-full max-w-xs w-full bg-slate-900 shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            {renderSidebar()}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <span className="text-slate-400">Admin</span>
              <span>/</span>
              <span className="text-slate-900 font-semibold capitalize">
                {location.pathname.split('/')[1] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {conferenceContext ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span>{conferenceContext.shortName}</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Master Scope</span>
              </div>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-xs">
                {user?.username?.[0] || 'A'}
              </div>
              <div className="hidden md:block text-left mr-1">
                <p className="text-xs font-bold text-slate-800 leading-none">{user?.username || 'Admin'}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{user?.role || role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-colors shadow-2xs cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
