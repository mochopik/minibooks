const express = require('express');
const {ensureAuthenticated} = require('../helpers/auth');

const router = express.Router();

// Stories index
router.get('/', (req, res) => {
    res.render('stories/index');
});

// Add Story form
router.get('/add',ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

module.exports = router;