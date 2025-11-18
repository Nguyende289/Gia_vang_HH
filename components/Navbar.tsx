
import React from 'react';
import { ViewState, User } from '../types';
import { PlusCircle, List, BarChart3, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
  currentUser: User;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView, onLogout, currentUser }) => {
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    const isActive = currentView === view;
    const activeClass = isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50';
    
    return (
      <button 
        onClick={() => onChangeView(view)}
        className={`flex flex-col items-center justify-center flex-1 h-full gap-1 rounded-xl transition-all duration-200 ${activeClass}`}
      >
        <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-2 pb-2 pt-2 flex justify-around items-center z-50 max-w-screen-2xl mx-auto">
      <NavItem view="list" icon={List} label="Danh sách" />
      
      <button 
        onClick={() => onChangeView('create')}
        className="flex flex-col items-center justify-center -mt-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg shadow-blue-300 hover:bg-blue-700 hover:scale-105 transition-all"
      >
        <PlusCircle size={28} />
      </button>

      <NavItem view="dashboard" icon={BarChart3} label="Tiến độ" />
      
      <button 
        onClick={() => {
          if (confirm('Bạn có chắc muốn đăng xuất?')) {
            onLogout();
          }
        }}
        className="flex flex-col items-center justify-center flex-1 h-full gap-1 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
      >
        <LogOut size={22} />
        <span className="text-[10px] font-medium">Thoát</span>
      </button>
    </div>
  );
};

export default Navbar;
