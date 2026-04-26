import React, { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("devinsight-user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem("devinsight-user");
      }
    }
  }, []);

  const handleLogin = (nextUser) => {
    setUser(nextUser);
    window.localStorage.setItem("devinsight-user", JSON.stringify(nextUser));
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("devinsight-user");
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-bg">
      <Navbar onLogout={handleLogout} />
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard user={user} />
      </main>
    </div>
  );
}

export default App;
