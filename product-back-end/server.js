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

for(let i = 0; i < defaultProducts.length; i++) {
    const id = crypto.randomUUID();
    let newItem = {
        id: id,
        name: defaultProducts.at(i).name,
        price: defaultProducts.at(i).price,
        image: defaultProducts.at(i).image
    };
    productItems.push(newItem);
    console.log("Added a default item in Post");
}

app.post('/api/products', (req, res) => {
    const id = crypto.randomUUID();
    let newItem = {
        id: id,
        name: req.body.name,
        price: req.body.price
    };
    productItems.push(newItem);
    res.send(newItem);
    console.log("Added new item in Post");
});

app.get('/api/products', (req, res) => {
    console.log("Returned All Items");
    res.send(productItems);
});

app.get('/api/products/:id', (req, res) => {
    let givenId = req.params.id;
    let index = productItems.find(element => element.id == givenId);
    if (index === undefined) {
        console.log("Returned Not Found Error");
        res.status(404)
            .send("Sorry, that item doesn't exist");
        return;
    } else {
        console.log("Returned Specific Item");
        res.send(index);
    }
});

app.delete('/api/products/:id', (req, res) => {
    let givenId = req.params.id;
    let removeIndex = productItems.find(element => element.id == givenId);
    if (removeIndex === undefined) {
        console.log("Didn't find item to delete");
        res.status(404)
            .send("Sorry, that item doesn't exist");
        return;
    }
    console.log("Deleting Requested Item");
    productItems = productItems.filter(element => element.id != givenId);
    res.sendStatus(200);
});





app.listen(3000, () => console.log('Server listening on port 3000!'));