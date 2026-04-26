const express = require('express');
const cors = require('cors');
require('dotenv').config();

const metricsRoutes = require('./routes/metricsRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/metrics', metricsRoutes);
app.use('/api/ai', aiRoutes);

module.exports = app;
