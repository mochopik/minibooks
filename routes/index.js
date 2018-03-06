const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Its Works!');
});

router.get('/dashboard', (req, res) => {
    res.send('Dashboard');
});

module.exports = router;