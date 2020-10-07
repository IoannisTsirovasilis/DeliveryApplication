var express = require('express');
var router = express.Router();
const config = require('config');
const context = require('./../models/context');
const { ObjectId } = require('mongodb');
const cartModel = require('./../models/cart');
const orderModel = require('./../models/order');
const userModel = require('./../models/user');

// GET orders
router.get('/', async function(req, res) {
  try {
    let db = await context.get();
    let orders = await orderModel.find(db, {});
    res.render('orders', { title: 'Orders Summary', orders });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// POST function for adding an order
router.post('/cart/:cartId/', async function(req, res) {
    let cartId = req.params.cartId;
    let db = await context.get();

    try {
        let cart = await cartModel.findOne(db, { _id : new ObjectId(cartId), status : config.get('schema.carts.active') });

        if (cart === null) {
            res.sendStatus(400);
            return;
        }

        let user = await userModel.findOne(db, { _id : new ObjectId(cart.userId) });

        if (user === null) {
            res.sendStatus(400);
            return;
        }

        // insert order in orders collection
        cart.status = config.get('schema.carts.completed');
        let document = { user : user, cart : cart, totalPrice : cart.totalPrice, createdOn : new Date() };
        await orderModel.insertOne(db, document);

        // update cart with 'completed' status
        let query = { _id : new ObjectId(cart._id), status : config.get('schema.carts.active') };
        let update = {
            $set: { 
                modifiedOn : new Date(),
                status : config.get('schema.carts.completed')
            }
        };

        await cartModel.updateOne(db, query, update);

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;