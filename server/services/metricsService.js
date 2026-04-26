const sourceData = require("../data/sourceData");

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getMonthWindow(month) {
  const [year, monthIndex] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthIndex - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
  return { start, end };
}

function isInMonth(isoDate, month) {
  const value = new Date(isoDate);
  const { start, end } = getMonthWindow(month);
  return value >= start && value < end;
}

function averageInDays(items, startKey, endKey) {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, item) => {
    const start = new Date(item[startKey]);
    const end = new Date(item[endKey]);
    return sum + (end - start) / MS_PER_DAY;
  }, 0);
  return total / items.length;
}

function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function getPreviousMonth(month) {
  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthIndex - 1, 1));
  date.setUTCMonth(date.getUTCMonth() - 1);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getStatus(metricKey, value) {
  const bands = {
    leadTime: [4, 7],
    cycleTime: [3, 6],
    bugRate: [0.15, 0.3],
    deploymentFrequency: [3, 2],
    prThroughput: [4, 3],
  };

  const [good, warning] = bands[metricKey];

  if (metricKey === "deploymentFrequency" || metricKey === "prThroughput") {
    if (value >= good) return "good";
    if (value >= warning) return "ok";
    return "risk";
  }

  if (value <= good) return "good";
  if (value <= warning) return "ok";
  return "risk";
}

function getDeveloperMetrics(developerId, month) {
  const dev = sourceData.developers.find((d) => d.id === developerId);
  if (!dev) return null;

  const prs = sourceData.pullRequests.filter(
    (pr) => pr.developerId === developerId && isInMonth(pr.mergedAt, month)
  );

  const successfulProdDeployments = sourceData.deployments.filter(
    (dep) =>
      dep.developerId === developerId &&
      dep.environment === "prod" &&
      dep.status === "success" &&
      isInMonth(dep.deployedAt, month)
  );

  const deploymentByPrId = new Map(successfulProdDeployments.map((dep) => [dep.prId, dep]));
  const leadTimeItems = prs
    .filter((pr) => deploymentByPrId.has(pr.id))
    .map((pr) => ({
      openedAt: pr.openedAt,
      deployedAt: deploymentByPrId.get(pr.id).deployedAt,
    }));

  const completedIssues = sourceData.issues.filter(
    (issue) => issue.developerId === developerId && isInMonth(issue.doneAt, month)
  );

  const escapedBugs = sourceData.bugs.filter(
    (bug) =>
      bug.developerId === developerId &&
      bug.environment === "prod" &&
      isInMonth(bug.foundAt, month)
  );

  const leadTime = round(averageInDays(leadTimeItems, "openedAt", "deployedAt"));
  const cycleTime = round(averageInDays(completedIssues, "inProgressAt", "doneAt"));
  const bugRate = completedIssues.length
    ? round(escapedBugs.length / completedIssues.length, 3)
    : 0;
  const deploymentFrequency = successfulProdDeployments.length;
  const prThroughput = prs.length;

  return {
    developer: dev,
    month,
    metrics: {
      leadTime,
      cycleTime,
      bugRate,
      deploymentFrequency,
      prThroughput,
    },
    evidence: {
      mergedPrs: prThroughput,
      completedIssues: completedIssues.length,
      escapedBugs: escapedBugs.length,
      successfulProdDeployments: deploymentFrequency,
    },
  };
}

function withComparison(current) {
  const previousMonth = getPreviousMonth(current.month);
  const previous = getDeveloperMetrics(current.developer.id, previousMonth);
  const result = {};

  const entries = Object.entries(current.metrics);
  for (const [key, value] of entries) {
    const previousValue = previous?.metrics?.[key] ?? 0;
    let deltaPct = 0;
    if (previousValue === 0 && value > 0) {
      deltaPct = 100;
    } else if (previousValue > 0) {
      deltaPct = round(((value - previousValue) / previousValue) * 100);
    }

    result[key] = {
      value,
      previousValue,
      deltaPct,
      status: getStatus(key, value),
    };
  }

  return {
    ...current,
    previousMonth,
    metrics: result,
  };
}

function buildInsights(metricResponse) {
  const { metrics, evidence, month, previousMonth } = metricResponse;
  const story = [];
  const actions = [];
  const facts = [];

  if (metrics.leadTime.deltaPct > 15 && metrics.prThroughput.deltaPct <= 0) {
    story.push("Lead time increased while throughput stayed flat, suggesting review or release wait time is growing.");
    actions.push("Split one large PR into two smaller PRs this sprint to reduce review turnaround.");
  }

  if (metrics.bugRate.value > 0.2) {
    story.push("Escaped bug rate is elevated, indicating quality checks before production may be inconsistent.");
    actions.push("Add a pre-merge checklist for regression scenarios on high-risk changes.");
  }

  if (metrics.cycleTime.value > 5) {
    story.push("Cycle time is high, which can signal oversized tasks or blocked handoffs.");
    actions.push("Break next sprint tickets into smaller deliverables with clear acceptance criteria.");
  }

  if (story.length === 0) {
    story.push("Delivery health is stable overall with no critical risk in the current month.");
    actions.push("Keep WIP limits and review cadence consistent to protect current performance.");
  }

  facts.push(`${evidence.mergedPrs} merged PRs in ${month}.`);
  facts.push(`${evidence.successfulProdDeployments} successful production deployments in ${month}.`);
  facts.push(`${evidence.escapedBugs} escaped production bugs vs ${evidence.completedIssues} completed issues.`);
  facts.push(`Month-over-month comparison baseline: ${previousMonth}.`);

  return {
    likelyStory: story.slice(0, 3),
    recommendedActions: actions.slice(0, 2),
    evidence: facts,
  };
}

function listDevelopers() {
  return sourceData.developers;
}

function listAvailableMonths() {
  return ["2026-01", "2026-02"];
}

function getManagerSummary(month) {
  const rows = sourceData.developers
    .map((dev) => {
      const current = getDeveloperMetrics(dev.id, month);
      if (!current) return null;
      const withCmp = withComparison(current);
      return {
        developer: dev.name,
        team: dev.team,
        metrics: withCmp.metrics,
      };
    })
    .filter(Boolean);

  if (!rows.length) return { month, teamAverages: {}, developers: [], topRisks: [] };

  const keys = ["leadTime", "cycleTime", "bugRate", "deploymentFrequency", "prThroughput"];
  const teamAverages = {};
  for (const key of keys) {
    const values = rows.map((row) => row.metrics[key].value);
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    teamAverages[key] = round(average, key === "bugRate" ? 3 : 2);
  }

  const topRisks = [];
  rows.forEach((row) => {
    keys.forEach((key) => {
      if (row.metrics[key].status === "risk") {
        topRisks.push({
          developer: row.developer,
          metric: key,
          value: row.metrics[key].value,
        });
      }
    });
  });

  return {
    month,
    teamAverages,
    developers: rows,
    topRisks: topRisks.slice(0, 5),
  };
}

module.exports = {
  getDeveloperMetrics,
  withComparison,
  buildInsights,
  listDevelopers,
  listAvailableMonths,
  getManagerSummary,
};
