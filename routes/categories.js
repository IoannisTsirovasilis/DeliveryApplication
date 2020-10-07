var express = require('express');
var router = express.Router();
const context = require('./../models/context');
const categoryModel = require('./../models/category');

// get categories with items for the 'Menu'
router.get('/', async function(req, res) {
    try {
        let db = await context.get();
        let categories = await categoryModel.find(db, {});
        res.send(categories);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;