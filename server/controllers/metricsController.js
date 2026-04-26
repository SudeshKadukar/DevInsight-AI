const {
  getDeveloperMetrics,
  withComparison,
  buildInsights,
  listDevelopers,
  listAvailableMonths,
  getManagerSummary,
} = require("../services/metricsService");

exports.getDevelopers = (_req, res) => {
  res.json(listDevelopers());
};

exports.getMonths = (_req, res) => {
  res.json(listAvailableMonths());
};

exports.getMetrics = (req, res) => {
  const { developerId, month } = req.query;
  if (!developerId || !month) {
    return res.status(400).json({ error: "developerId and month are required query params." });
  }

  const current = getDeveloperMetrics(developerId, month);
  if (!current) {
    return res.status(404).json({ error: "Developer not found." });
  }

  return res.json(withComparison(current));
};

exports.getInsights = (req, res) => {
  const { developerId, month } = req.query;
  if (!developerId || !month) {
    return res.status(400).json({ error: "developerId and month are required query params." });
  }

  const current = getDeveloperMetrics(developerId, month);
  if (!current) {
    return res.status(404).json({ error: "Developer not found." });
  }

  const metricsWithComparison = withComparison(current);
  return res.json(buildInsights(metricsWithComparison));
};

exports.getManagerSummary = (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({ error: "month is a required query param." });
  }
  return res.json(getManagerSummary(month));
};
