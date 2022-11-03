const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
const defaultProducts = require('./products');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

let productItems = [];
let cartItems = [];

for (let i = 0; i < defaultProducts.length; i++) {
    const id = crypto.randomUUID();
    let newItem = {
        id: id,
        name: defaultProducts.at(i).name,
        price: defaultProducts.at(i).price,
        image: defaultProducts.at(i).image
    };
    productItems.push(newItem);
    console.log("Added a default product: " + defaultProducts.at(i).name);
}

//BELOW IS THE SECTION FOR THE PRODUCTS!!!

app.post('/api/products', (req, res) => {
    const id = crypto.randomUUID();
    let newItem = {
        id: id,
        name: req.body.name,
        price: req.body.price
    };
    productItems.push(newItem);
    res.send(newItem);
    console.log("Added new product in Post: " + req.body.name);
});

app.get('/api/products', (req, res) => {
    res.send(productItems);
    console.log("Returned All Products");
});

app.get('/api/products/:id', (req, res) => {
    let givenId = req.params.id;
    let index = productItems.find(element => element.id == givenId);
    if (index === undefined) {
        console.log("Returned Product Not Found Error");
        res.status(404)
            .send("Sorry, that product doesn't exist");
        return;
    } else {
        console.log("Returned Specific Product");
        res.send(index);
    }
});

app.delete('/api/products/:id', (req, res) => {
    let givenId = req.params.id;
    let removeIndex = productItems.find(element => element.id == givenId);
    if (removeIndex === undefined) {
        console.log("Didn't find product to delete");
        res.status(404)
            .send("Sorry, that item doesn't exist");
        return;
    }
    console.log("Deleting Requested Product");
    productItems = productItems.filter(element => element.id != givenId);
    res.sendStatus(200);
});

//BELOW IS THE SECTION FOR THE SHOPPING CART!!!

app.get('/api/cart', (req, res) => {
    console.log("Returned All Cart Items");
    res.send(cartItems);
});

app.post('/api/cart/:id', (req, res) => {
    let givenId = req.params.id;
    let index = cartItems.find(element => element.id == givenId);
    if (index === undefined) {
        console.log("Adding In New Cart Item");
        let newCartItem = {
            id: givenId,
            quantity: 1
        };
        cartItems.push(newCartItem);
        res.send(newCartItem);
    } else {
        console.log("Increasing Quantity Of A Cart Item");
        index.quantity++;
        res.send(index);
    }
});

app.put('/api/cart/:id/:quantity', (req, res) => {
    let givenId = req.params.id;
    let givenQuantity = parseInt(req.params.quantity);
    let index = cartItems.find(element => element.id == givenId);
    if (givenQuantity === 0) {
        cartItems = cartItems.filter(element => element.id != givenId);
        res.sendStatus(200);
        return;
    }
    if (index === undefined) {
        console.log("Returned Not Found Error in Cart");
        res.status(404)
            .send("Sorry, I Coudn't Find That Item In The Cart");
        return;
    } else {
        console.log("Setting The Quantity Of A Cart Item");
        index.quantity = givenQuantity;
        res.send(index);
    }
});

app.delete('/api/cart/:id', (req, res) => {
    let givenId = req.params.id;
    let removeIndex = cartItems.find(element => element.id == givenId);
    if (removeIndex === undefined) {
        console.log("Didn't find item to delete");
        res.status(404)
            .send("Sorry, that item doesn't exist");
        return;
    }
    console.log("Deleting Requested Cart Item");
    cartItems = cartItems.filter(element => element.id != givenId);
    res.sendStatus(200);
});





app.listen(3000, () => console.log('Server listening on port 3000!'));