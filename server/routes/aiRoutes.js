const express = require('express');
const router = express.Router();
const { explainMetrics } = require('../controllers/aiController');

router.post('/explain', explainMetrics);

module.exports = router;
