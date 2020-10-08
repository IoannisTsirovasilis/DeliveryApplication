const express = require('express');
const router = express.Router();
const context = require('./../models/context');
const categoryModel = require('./../models/category');
const currencyConverter = require('./../utils/currencyConverter');

// GET categories with items for the 'Menu'
router.get('/', async function(req, res) {
    try {
        const db = await context.get();
        const categories = await categoryModel.find(db, {});
        res.send(categories);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// GET categories with items for the 'Menu' with specific currency
router.get('/currency/:currency', async function(req, res) {
    try {
        const currency = req.params.currency;
        const db = await context.get();
        const categories = await categoryModel.find(db, {});
        const prices = [];
        for (let c in categories) {
            for (let i in categories[c].items) 
            {
                // Prepare calls to the currency conversion API
                prices.push(currencyConverter.convert(categories[c].items[i].price, currency));
            }
        }

        // await all the calls to finish
        const results = await Promise.all(prices);

        // replace EUR prices with converted prices
        let r = 0;
        for (let c in categories) {
            for (let i in categories[c].items) {
                categories[c].items[i].price = results[r++];
            }
        }

        res.send(categories);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;