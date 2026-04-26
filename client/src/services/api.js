import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/metrics",
});

const fallbackDevelopers = [{ id: "dev-1", name: "Aarav Singh", team: "Platform" }];
const fallbackMonths = ["2026-02"];

function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function toNewMetricShape(raw) {
  const leadTime = raw.leadTime ?? 0;
  const cycleTime = raw.cycleTime ?? 0;
  const bugRateRaw = raw.bugRate ?? 0;
  const bugRate = bugRateRaw > 1 ? round(bugRateRaw / 100, 3) : bugRateRaw;
  const deploymentFrequency = raw.deploymentFrequency ?? 0;
  const prThroughput = raw.prThroughput ?? 0;

  const makeEntry = (value, status = "ok") => ({
    value,
    previousValue: value,
    deltaPct: 0,
    status,
  });

  return {
    developer: fallbackDevelopers[0],
    month: fallbackMonths[0],
    previousMonth: fallbackMonths[0],
    metrics: {
      leadTime: makeEntry(leadTime, leadTime > 7 ? "risk" : leadTime > 4 ? "ok" : "good"),
      cycleTime: makeEntry(cycleTime, cycleTime > 6 ? "risk" : cycleTime > 3 ? "ok" : "good"),
      bugRate: makeEntry(bugRate, bugRate > 0.3 ? "risk" : bugRate > 0.15 ? "ok" : "good"),
      deploymentFrequency: makeEntry(
        deploymentFrequency,
        deploymentFrequency >= 3 ? "good" : deploymentFrequency >= 2 ? "ok" : "risk"
      ),
      prThroughput: makeEntry(prThroughput, prThroughput >= 4 ? "good" : prThroughput >= 3 ? "ok" : "risk"),
    },
    evidence: {
      mergedPrs: prThroughput,
      completedIssues: 0,
      escapedBugs: 0,
      successfulProdDeployments: deploymentFrequency,
    },
  };
}

export async function fetchDevelopers() {
  try {
    const response = await api.get("/developers");
    return response.data;
  } catch (error) {
    return fallbackDevelopers;
  }
}

export async function fetchMonths() {
  try {
    const response = await api.get("/months");
    return response.data;
  } catch (error) {
    return fallbackMonths;
  }
}

export async function fetchMetrics(developerId, month) {
  try {
    const response = await api.get("/", { params: { developerId, month } });
    return response.data;
  } catch (error) {
    try {
      const legacy = await api.get("/");
      return toNewMetricShape(legacy.data || {});
    } catch (legacyError) {
      return toNewMetricShape({});
    }
  }
}

export async function fetchInsights(developerId, month, metricsPayload) {
  try {
    const response = await api.get("/insights", { params: { developerId, month } });
    return response.data;
  } catch (error) {
    const bugRate = metricsPayload?.metrics?.bugRate?.value ?? 0;
    const leadTime = metricsPayload?.metrics?.leadTime?.value ?? 0;

    const likelyStory = [];
    const recommendedActions = [];

    if (leadTime > 5) {
      likelyStory.push("Lead time is elevated, which may indicate review or release wait bottlenecks.");
      recommendedActions.push("Split one larger PR into smaller slices this sprint.");
    }
    if (bugRate > 0.2) {
      likelyStory.push("Escaped bug rate is high relative to delivery pace.");
      recommendedActions.push("Add a focused regression checklist for high-risk stories.");
    }
    if (likelyStory.length === 0) {
      likelyStory.push("Current metrics appear stable with no severe month-level signal.");
      recommendedActions.push("Maintain current review cadence and WIP discipline.");
    }

    return {
      likelyStory,
      recommendedActions: recommendedActions.slice(0, 2),
      evidence: [
        "Running in compatibility mode with legacy metrics endpoint.",
        "Start the updated backend to unlock full month-over-month insights.",
      ],
    };
  }
}

export async function fetchManagerSummary(month) {
  try {
    const response = await api.get("/manager-summary", { params: { month } });
    return response.data;
  } catch (error) {
    return {
      month,
      teamAverages: {},
      developers: [],
      topRisks: [],
    };
  }
}
