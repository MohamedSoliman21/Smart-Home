const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Placeholder for automation routes
router.get('/', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Automation routes coming soon',
    data: []
  });
});

module.exports = router;
