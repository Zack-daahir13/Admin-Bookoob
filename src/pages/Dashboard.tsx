import { Link } from "react-router-dom"; // Import Link component
import { Layers, User, BookOpen, Users } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard icon={Layers} title="Categories" count={12} to="/category" />
        <DashboardCard icon={User} title="Authors" count={45} to="/author" />
        <DashboardCard icon={BookOpen} title="Books" count={320} to="/book" />
        <DashboardCard icon={Users} title="Users" count={1200} to="/user" />
      </div>
    </div>
  );
};

const DashboardCard = ({ icon: Icon, title, count, to }: { icon: any; title: string; count: number; to: string }) => {
  return (
    <Link to={to} className="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4 hover:bg-gray-100 transition">
      <div className="p-3 bg-blue-500 text-white rounded-lg">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">{count}</h2>
        <p className="text-gray-600">{title}</p>
      </div>
    </Link>
  );
};

export default Dashboard;
