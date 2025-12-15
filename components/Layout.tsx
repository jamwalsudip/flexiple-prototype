import React from 'react';
import { Briefcase, Search, UserPlus, Menu, X, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-indigo-600';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 text-[13px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-slate-900 tracking-tight leading-tight">Flexiple</span>
                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider w-fit">Prototype</span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`flex items-center gap-1.5 text-[13px] ${isActive('/')}`}>
                <Search className="w-3.5 h-3.5" /> Find Talent
              </Link>
              <Link to="/post-job" className={`flex items-center gap-1.5 text-[13px] ${isActive('/post-job')}`}>
                <Briefcase className="w-3.5 h-3.5" /> Post a Job
              </Link>
              <Link to="/dashboard" className={`flex items-center gap-1.5 text-[13px] ${isActive('/dashboard')}`}>
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <div className="h-6 w-px bg-slate-200 mx-1.5"></div>
              <Link to="/talent-join" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-colors shadow-sm flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" /> Join as Talent
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="pt-2 pb-3 space-y-1 px-4 shadow-lg text-[13px]">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50">Find Talent</Link>
              <Link to="/post-job" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50">Post Job</Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50">Dashboard</Link>
              <Link to="/talent-join" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-indigo-600 bg-indigo-50 mt-2">Join as Talent</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Flexiple - Prototype. Built with Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;