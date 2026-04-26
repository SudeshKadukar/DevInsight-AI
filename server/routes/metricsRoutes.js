const express = require('express');
const router = express.Router();
const {
  getDevelopers,
  getMonths,
  getMetrics,
  getInsights,
  getManagerSummary,
} = require('../controllers/metricsController');

router.get('/developers', getDevelopers);
router.get('/months', getMonths);
router.get('/', getMetrics);
router.get('/insights', getInsights);
router.get('/manager-summary', getManagerSummary);

module.exports = router;
