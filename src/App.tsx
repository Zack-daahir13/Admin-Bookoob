import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router components
import Login from "./pages/Login";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CategoryPage from "./pages/Category";
import AuthorPage from "./pages/Author";
import BookPage from "./pages/Book";
import UserPage from "./pages/User";
import NotificationPage from "./pages/Notification";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout} // Pass logout function
        />
        <div className="flex flex-col flex-1 overflow-y-auto max-h-full ">
          <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main  className="p-2 md:p-6 bg-gray-100 flex-1 overflow-y-auto ">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/category" element={<CategoryPage />} />
              <Route path="/author" element={<AuthorPage />} />
              <Route path="/book" element={<BookPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/notification" element={<NotificationPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
