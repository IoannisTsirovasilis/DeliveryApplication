const express = require('express');
const router = express.Router();
const config = require('config');
const context = require('./../models/context');
const { ObjectId } = require('mongodb');
const cartModel = require('./../models/cart');
const orderModel = require('./../models/order');
const userModel = require('./../models/user');

// GET orders
router.get('/', async function(req, res) {
  try {
    const db = await context.get();
    const orders = await orderModel.find(db, {});
    res.render('orders', { title: 'Orders Summary', orders });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// POST function for adding an order
router.post('/cart/:cartId/', async function(req, res) {
    const cartId = req.params.cartId;
    const db = await context.get();

    try {
      const cart = await cartModel.findOne(db, { _id : new ObjectId(cartId), status : config.get('schema.carts.active') });

        if (cart === null) {
            res.sendStatus(400);
            return;
        }

        const user = await userModel.findOne(db, { _id : new ObjectId(cart.userId) });

        // insert order in orders collection
        cart.status = config.get('schema.carts.completed');
        const document = { user : user, cart : cart, totalPrice : cart.totalPrice, createdOn : new Date() };
        await orderModel.insertOne(db, document);

        // update cart with 'completed' status
        const query = { _id : new ObjectId(cart._id), status : config.get('schema.carts.active') };
        const update = {
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