
import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-surface-border bg-background-dark/50 backdrop-blur-md px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-white">
          <Menu size={24} />
        </button>
        <h2 className="text-white text-xl font-bold tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center bg-surface-dark rounded-full px-4 py-2 border border-surface-border focus-within:border-primary/50 transition-colors w-72">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Buscar test o documento..." 
            className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full focus:ring-0 p-0"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative flex items-center justify-center rounded-full size-10 hover:bg-surface-dark text-slate-300 hover:text-white transition-colors">
            <Bell size={22} />
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border border-background-dark"></span>
          </button>
          <div 
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-surface-border cursor-pointer hover:border-primary/50 transition-all"
            style={{ backgroundImage: 'url("https://picsum.photos/200")' }}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
