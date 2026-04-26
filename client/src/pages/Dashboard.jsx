import React, { useEffect, useMemo, useState } from "react";
import { Clock3, Bug, GitPullRequest, Rocket, RefreshCcw } from "lucide-react";
import MetricCard from "../components/MetricCard";
import AIChatInsight from "../components/AIChatInsight";
import { fetchDevelopers, fetchInsights, fetchManagerSummary, fetchMetrics, fetchMonths } from "../services/api";

const metricCards = [
  { key: "leadTime", title: "Lead Time for Changes", unit: "days", icon: Clock3 },
  { key: "cycleTime", title: "Cycle Time", unit: "days", icon: RefreshCcw },
  { key: "bugRate", title: "Bug Rate", unit: "ratio", icon: Bug },
  { key: "deploymentFrequency", title: "Deployment Frequency", unit: "deploys", icon: Rocket },
  { key: "prThroughput", title: "PR Throughput", unit: "merged PRs", icon: GitPullRequest },
];

function getWeeklyExperiment(metrics) {
  const leadTime = metrics?.leadTime?.value ?? 0;
  const bugRate = metrics?.bugRate?.value ?? 0;
  const cycleTime = metrics?.cycleTime?.value ?? 0;

  if (bugRate > 0.25) {
    return {
      title: "Quality Gate Experiment",
      action: "For every PR touching production paths, add one regression checklist item before merge.",
      impact: "Lower escaped bugs in the next release cycle.",
      successMetric: "Bug Rate",
      successTarget: "Reduce by at least 15% next month",
      effort: "Low",
    };
  }

  if (leadTime > 6 || cycleTime > 5) {
    return {
      title: "Flow Speed Experiment",
      action: "Split one medium/large task into two PRs and request first review within 24 hours.",
      impact: "Reduce wait time in review/release queue.",
      successMetric: "Lead Time for Changes",
      successTarget: "Reduce by at least 10% next month",
      effort: "Medium",
    };
  }

  return {
    title: "Consistency Experiment",
    action: "Keep WIP to one active ticket per developer and keep PR size focused on one concern.",
    impact: "Protect stable throughput and quality trend.",
    successMetric: "Cycle Time",
    successTarget: "Keep variation within +/-10%",
    effort: "Low",
  };
}

const Dashboard = ({ user }) => {
  const [developers, setDevelopers] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [managerSummary, setManagerSummary] = useState(null);
  const [viewMode, setViewMode] = useState(user?.role === "manager" ? "manager" : "ic");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [allDevelopers, allMonths] = await Promise.all([fetchDevelopers(), fetchMonths()]);
        setDevelopers(allDevelopers);
        setMonths(allMonths);
        if (allDevelopers.length) setSelectedDeveloper(allDevelopers[0].id);
        if (allMonths.length) setSelectedMonth(allMonths[allMonths.length - 1]);
      } catch (apiError) {
        setError("Failed to load initial data.");
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedDeveloper || !selectedMonth) return;
    async function loadMetricsAndInsights() {
      setLoading(true);
      setLoadingInsights(true);
      setError("");
      try {
        const metricsResponse = await fetchMetrics(selectedDeveloper, selectedMonth);
        setData(metricsResponse);
        setLoading(false);

        const insightResponse = await fetchInsights(selectedDeveloper, selectedMonth, metricsResponse);
        setInsights(insightResponse);
        const managerResponse = await fetchManagerSummary(selectedMonth);
        setManagerSummary(managerResponse);
      } catch (apiError) {
        setError("Failed to load dashboard data. Please check backend server.");
      } finally {
        setLoading(false);
        setLoadingInsights(false);
      }
    }
    loadMetricsAndInsights();
  }, [selectedDeveloper, selectedMonth]);

  useEffect(() => {
    const handleViewSwitch = (event) => {
      const requestedView = event?.detail?.view;
      if (requestedView === "ic" || requestedView === "manager") {
        setViewMode(requestedView);
      }
    };

    window.addEventListener("devinsight:set-view", handleViewSwitch);
    return () => {
      window.removeEventListener("devinsight:set-view", handleViewSwitch);
    };
  }, []);

  const selectedDeveloperMeta = useMemo(
    () => developers.find((dev) => dev.id === selectedDeveloper),
    [developers, selectedDeveloper]
  );
  const weeklyExperiment = useMemo(
    () => getWeeklyExperiment(data?.metrics),
    [data]
  );

  return (
    <div className="space-y-8 pb-10">
      <header className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">IC Productivity View</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Understand your delivery metrics, likely story, and practical next steps.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("ic")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              viewMode === "ic"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            Individual Contributor View
          </button>
          <button
            onClick={() => setViewMode("manager")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              viewMode === "manager"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            Manager Summary
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedDeveloper}
            onChange={(e) => setSelectedDeveloper(e.target.value)}
            className="flex-1 min-w-[220px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            {developers.map((dev) => (
              <option value={dev.id} key={dev.id}>
                {dev.name} ({dev.team})
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex-1 min-w-[220px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          >
            {months.map((month) => (
              <option value={month} key={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        {selectedDeveloperMeta ? (
          <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
            {selectedDeveloperMeta.photo && (
              <img src={selectedDeveloperMeta.photo} alt={selectedDeveloperMeta.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
            )}
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Viewing: <span className="font-semibold">{selectedDeveloperMeta.name}</span> - {selectedDeveloperMeta.team}
              </p>
              <div className="flex gap-4">
                {selectedDeveloperMeta.email && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {selectedDeveloperMeta.email}
                  </p>
                )}
                {selectedDeveloperMeta.github && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                    <span className="w-4 h-4 mr-1.5 opacity-70">GH:</span>
                    {selectedDeveloperMeta.github}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}
        {error ? (
          <p className="text-sm text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-md px-3 py-2">
            {error}
          </p>
        ) : null}
      </header>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <RefreshCcw className="animate-spin text-indigo-500 mb-4" size={28} />
          <p className="text-slate-500 dark:text-slate-400">Calculating assignment metrics...</p>
        </div>
      ) : !data ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <p className="text-slate-700 dark:text-slate-300">
            Metric data is temporarily unavailable. Verify backend is running at `http://localhost:5000`.
          </p>
        </div>
      ) : viewMode === "manager" ? (
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-lg mb-3">Team Averages ({managerSummary?.month || selectedMonth})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 text-sm">
              {Object.entries(managerSummary?.teamAverages || {}).map(([key, value]) => (
                <div key={key} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <p className="text-slate-500 dark:text-slate-300">{key}</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-lg mb-3">Top Risk Signals</h2>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {(managerSummary?.topRisks || []).length ? (
                managerSummary.topRisks.map((risk, idx) => (
                  <li key={`${risk.developer}-${risk.metric}-${idx}`}>
                    - {risk.developer}: {risk.metric} at {risk.value}
                  </li>
                ))
              ) : (
                <li>- No high-risk metric flags for this month.</li>
              )}
            </ul>
          </section>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {metricCards.map((metric, index) => {
              const entry = data?.metrics?.[metric.key];
              return (
                <MetricCard
                  key={metric.key}
                  title={metric.title}
                  value={entry?.value ?? 0}
                  unit={metric.unit}
                  deltaPct={entry?.deltaPct ?? 0}
                  status={entry?.status ?? "ok"}
                  icon={metric.icon}
                  delay={index * 0.05}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-lg mb-3">Likely Story</h2>
              {loadingInsights ? (
                <p className="text-slate-500">Generating interpretation...</p>
              ) : (
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {(insights?.likelyStory || []).map((line) => (
                    <li key={line}>- {line}</li>
                  ))}
                </ul>
              )}
            </section>
            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-lg mb-3">Recommended Next Steps</h2>
              {loadingInsights ? (
                <p className="text-slate-500">Loading actions...</p>
              ) : (
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {(insights?.recommendedActions || []).map((action) => (
                    <li key={action}>- {action}</li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-lg mb-3">Evidence</h2>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {(insights?.evidence || []).map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-xl border border-indigo-500/40 shadow-sm">
            <h2 className="font-semibold text-lg mb-3">This Week Experiment</h2>
            <p className="text-sm text-indigo-100 mb-3">
              A single focused experiment to move from insight to action.
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Experiment:</span> {weeklyExperiment.title}
              </p>
              <p>
                <span className="font-semibold">Action:</span> {weeklyExperiment.action}
              </p>
              <p>
                <span className="font-semibold">Expected Impact:</span> {weeklyExperiment.impact}
              </p>
              <p>
                <span className="font-semibold">Success Check:</span> {weeklyExperiment.successMetric} -{" "}
                {weeklyExperiment.successTarget}
              </p>
              <p>
                <span className="font-semibold">Effort:</span> {weeklyExperiment.effort}
              </p>
            </div>
          </section>

          <AIChatInsight data={data} insights={insights} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
