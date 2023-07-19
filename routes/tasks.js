const express = require('express');

const router = express.Router();

const DUMMY_TASKS = [
    {
        id: 't1',
        title: 'painting', 
        description: 'Painitng the monalisa',
        creator: 'u1'
    }
]

router.get('/', (req, res, next) => {
    console.log('Get request in tasks');
    res.json({ message: 'It works'});
});

module.exports = router;