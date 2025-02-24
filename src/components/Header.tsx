import { Menu, UserCircle } from "lucide-react";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Left Side - Site Name */}
      <h1 className="text-2xl font-bold text-gray-800">Bookoob</h1>

      {/* Right Side - Profile & Menu */}
      <div className="flex items-center gap-4">
        {/* Profile Section */}
        <div className="flex items-center gap-2 cursor-pointer">
          <UserCircle className="w-6 h-6 text-gray-600" />
          <span className="text-gray-700 font-medium">admin</span>
        </div>

        {/* Hamburger Menu */}
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;