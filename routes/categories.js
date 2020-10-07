var express = require('express');
var router = express.Router();
const context = require('./../models/context');
const categoryModel = require('./../models/category');
const currencyConverter = require('./../utils/currencyConverter');

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

// get categories with items for the 'Menu'
router.get('/currency/:currency', async function(req, res) {
    try {
        let currency = req.params.currency;
        let db = await context.get();
        let categories = await categoryModel.find(db, {});
        for (let c in categories) {
            for (let i in categories[c].items) 
            {
                categories[c].items[i].price = await currencyConverter.convert(categories[c].items[i].price, currency);
            }
        }
        res.send(categories);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;