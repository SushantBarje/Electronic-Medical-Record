var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/admin/login', (req, res) => {
    
})

module.exports = router;