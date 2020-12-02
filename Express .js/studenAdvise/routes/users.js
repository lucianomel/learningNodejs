const path = require('path');

const express = require('express');

const routeDir = require('../util/path');

const router = express.Router();

router.get('/users', (req, res, next) => {
    // console.log('Users route followed');
    res.sendFile(path.join(routeDir, 'views', 'users.html'));
});

module.exports = router;