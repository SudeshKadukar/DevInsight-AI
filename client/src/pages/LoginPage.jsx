import React, { useState } from "react";
import { LogIn } from "lucide-react";

const DEMO_EMAIL = "demo@devinsight.ai";
const MGR_EMAIL = "manager@devinsight.ai";
const DEMO_PASSWORD = "devinsight123";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      onLogin({ name: "Demo User", email: DEMO_EMAIL, role: "ic" });
      return;
    }
    if (cleanEmail === MGR_EMAIL && password === DEMO_PASSWORD) {
      onLogin({ name: "Demo Manager", email: MGR_EMAIL, role: "manager" });
      return;
    }
    setError("Invalid credentials. Use one of the demo credentials shown below.");
  };

  return (
    <div className="app-bg flex items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-md glass-card rounded-2xl p-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold hero-title">Sign in to DevInsight AI</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Continue to the IC productivity dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
          />
          {error ? (
            <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-300 border border-rose-200 dark:border-rose-700 rounded-md px-2 py-1.5">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-4 py-2 text-sm font-medium shadow-sm"
          >
            <LogIn size={16} />
            Sign in
          </button>
        </form>

        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 py-2 space-y-1">
          <p>IC Demo: <span className="font-semibold">{DEMO_EMAIL}</span> / <span className="font-semibold">{DEMO_PASSWORD}</span></p>
          <p>Mgr Demo: <span className="font-semibold">{MGR_EMAIL}</span> / <span className="font-semibold">{DEMO_PASSWORD}</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
