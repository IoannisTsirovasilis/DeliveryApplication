const express = require('express');
const router = express.Router();
const config = require('config');
const context = require('./../models/context');
const { ObjectId, Decimal128 } = require('mongodb');
const cartModel = require('./../models/cart');
const itemModel = require('./../models/item');
const userModel = require('./../models/user');
const currencyConverter = require('./../utils/currencyConverter');

// GET current cart
router.get('/user/:userId', async function(req, res) {
  try {
    const userId = req.params.userId;
    const db = await context.get();

    const user = await userModel.findOne(db, { _id : new ObjectId(userId) });

    if (user === null) {
      res.sendStatus(400);
      return;
    };

    const query = { userId : user._id, status : config.get('schema.carts.active') };
    const cart = await cartModel.findOne(db, query);

    res.send(cart);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// GET current cart with different currency
router.get('/user/:userId/currency/:currency', async function(req, res) {
  try {
    const userId = req.params.userId;
    const currency = req.params.currency;
    const db = await context.get();

    const user = await userModel.findOne(db, { _id : new ObjectId(userId) });

    if (user === null) {
      res.sendStatus(400);
      return;
    };

    const query = { userId : user._id, status : config.get('schema.carts.active') };
    const cart = await cartModel.findOne(db, query);
    const prices = [];
    for (let i in cart.items) {
      // Prepare calls to the currency conversion API
      prices.push(currencyConverter.convert(cart.items[i].price, currency));
    }

    prices.push(currencyConverter.convert(cart.totalPrice, currency));

    // await all the calls to finish
    const results = await Promise.all(prices);

    // replace EUR prices with converted prices
    let r = 0;
    for (let i in cart.items) {
      cart.items[i].price = results[r++];
    }
    cart.totalPrice = results[r];

    res.send(cart);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// PUT function for adding an item to the user's cart
router.put('/addItem/:itemId/user/:userId', async function(req, res) {
  try {
    const itemId = req.params.itemId;
    const userId = req.params.userId;

    const db = await context.get();
    
    const item = await itemModel.findOne(db, { _id : new ObjectId(itemId) });

    if (item === null) {
      res.sendStatus(400);
      return;
    };

    const user = await userModel.findOne(db, { _id : new ObjectId(userId) });

    if (user === null) {
      res.sendStatus(400);
      return;
    };

    // query to find the active cart of the user
    const query = { userId : user._id, status : config.get('schema.carts.active') };
    const cart = await cartModel.findOne(db, query);

    // Add quantity field to the item so that the cart knows how many times a user has requested the same item.
    item.quantity = 1;

    // if the cart has not yet been created, create it with the selected item
    if (cart === null) {      
      const document = { 
        userId : user._id, 
        status : config.get('schema.carts.active'),
        modifiedOn : new Date(),
        items: [item],
        totalPrice : Decimal128.fromString(item.price.toString())
      };
      cartModel.insertOne(db, document);        
    } else {
      // else, first check if the item already exists in the cart and increase the quantity and the price
      for (let i in cart.items) {
        if (cart.items[i]._id.equals(item._id)) {
          const query = { userId : user._id, status : config.get('schema.carts.active'), "items._id" : item._id };
          const update = {
            $set: { 
              modifiedOn : new Date()
            },
            $inc : {
              'items.$.quantity' : 1,
              totalPrice : Decimal128.fromString(item.price.toString())
            }
          };
          cartModel.updateOne(db, query, update);
          res.sendStatus(200);
          return;
        }
      }
      
      // if this part is reached then the item is not in the cart. Add it to the cart and increase the price
      const query = { userId : user._id, status : config.get('schema.carts.active')};
      const update = {
        $set: { 
          modifiedOn : new Date()
        },
        $inc: {
          totalPrice : Decimal128.fromString(item.price.toString())
        },
        $push: { items: item  }
      };
      cartModel.updateOne(db, query, update);
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// PUT function for removing an item from the cart
router.put('/removeItem/:itemId/user/:userId', async function(req, res) {
  try {
    const itemId = req.params.itemId;
    const userId = req.params.userId;
    
    const db = await context.get();

    const item = await itemModel.findOne(db, { _id : new ObjectId(itemId) });

    if (item === null) {
      res.sendStatus(400);
      return;
    };

    const user = await userModel.findOne(db, { _id : new ObjectId(userId) });

    if (user === null) {
      res.sendStatus(400);
      return;
    };

    // we assume that the cart is already present in the database
    const query = { userId : user._id, status : config.get('schema.carts.active') };
    const cart = await cartModel.findOne(db, query);

    // Iterate through items to find the one that we want to get it removed
    for (let i in cart.items) {
      if (cart.items[i]._id.equals(item._id)) {
        // if the quantity is 1, reduce price and remove the item complete from the 'items' array
        if (cart.items[i].quantity === 1) {
          const query = { userId : user._id, status : config.get('schema.carts.active'), "items._id" : item._id };
          const update = {
            $set: { 
              modifiedOn : new Date()
            },
            $inc : {
              totalPrice : Decimal128.fromString((-item.price).toString())
            },
            $pull: {
                items : {
                  _id : item._id
                }
            }
          };

          cartModel.updateOne(db, query, update);

        } else {
          // else reduce the price and the quantity by one
          const query = { userId : user._id, status : config.get('schema.carts.active'), "items._id" : item._id };
          const update = {
            $set: { 
              modifiedOn : new Date()
            },
            $inc : {
              'items.$.quantity' : -1,
              totalPrice : Decimal128.fromString((-item.price).toString())
            }
          };
          cartModel.updateOne(db, query, update);
        }
        break;        
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;