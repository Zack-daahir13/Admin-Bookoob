import { Link } from "react-router-dom"; // Import Link component
import { Home, Layers, User, BookOpen, Bell, Settings, LogOut } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, onLogout }) => {
  return (
    <aside
      className={`fixed overflow-y-scroll left-0 top-0 h-full max-h-full w-64 bg-gray-800 text-white transform  ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      } transition-transform duration-300 md:relative md:translate-x-0`}
    >
      <button onClick={toggleSidebar} className="absolute top-4 right-4 text-white md:hidden">
        ✖
      </button>
      <nav className="mt-16">
        <ul className="space-y-4">
          <SidebarItem icon={Home} label="Dashboard" to="/" />
          <SidebarItem icon={Layers} label="Category" to="/category" />
          <SidebarItem icon={User} label="Author" to="/author" />
          <SidebarItem icon={BookOpen} label="Book" to="/book" />
          <SidebarItem icon={User} label="User" to="/user" />
          <SidebarItem icon={Bell} label="Notification" to="/notification" />
          <SidebarItem icon={Settings} label="Settings" to="/settings" />
        </ul>
      </nav>
      <div className="absolute bottom-4 left-0 w-full">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 p-3 px-6 w-35 bg-blue-600 hover:bg-red-700 cursor-pointer ml-9 mr-1"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon: Icon, label, to }: { icon: any; label: string; to: string }) => {
  return (
    <Link to={to} className=" flex items-center gap-3 p-3 px-6 hover:bg-gray-700 cursor-pointer">
      <li className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </li>
    </Link>
  );
};

export default Sidebar;
