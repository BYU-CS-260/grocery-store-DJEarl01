import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [products, setProducts] = useState([]);
  const [cartItems, setCart] = useState([]);
  const [error, setError] = useState("");
  const [update, setUpdate] = useState(Boolean);

  //get all of the products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      setError("error retrieving products: " + error);
    }
    setUpdate(true);
  }

  // fetch product data
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchCart();
  }, [update]);

  //fetch cart data
  const fetchCart = async (state) => {
    try {
      const response = (await axios.get("/api/cart")).data;
      let tempCart = [];
      for (let i = 0; i < response.length; i++) {
        let tempAddition = products.find(element => element.id === response.at(i).id);
        tempAddition = {
          id: tempAddition.id,
          name: tempAddition.name,
          quantity: response.at(i).quantity
        }
        tempCart.push(tempAddition);
      }
      setCart(tempCart);
      setUpdate(false);
      setError('');
    } catch (error) {
      if (products.length === 0) {
        setError("Retrieving Cart...");
      } else {
        setError("error retrieving cart: " + error);
      }
    }
  }

  // subtract item quantity by 1
  const subtractItemQuantity = async (id) => {
    const targetURL = "/api/cart/" + id + "/" + ((cartItems.find(element => element.id === id)).quantity - 1);
    try {
      await axios.put(targetURL);
    } catch (error) {
      setError("error retrieving products: " + error);
    }
    setUpdate(true);
  }

  // add item quantity by 1
  const addItemQuantity = async (id) => {
    const targetURL = "/api/cart/" + id + "/" + ((cartItems.find(element => element.id === id)).quantity + 1);
    try {
      await axios.put(targetURL);
    } catch (error) {
      setError("error retrieving products: " + error);
    }
    setUpdate(true);
  }

  // remove a cart item
  const deleteCartItem = async (id) => {
    const targetURL = "/api/cart/" + id;
    try {
      await axios.delete(targetURL);
    } catch (error) {
      setError("error retrieving products: " + error);
    }
    setUpdate(true);
  }

  // add an id to cart
  const addToCart = async (id) => {
    let targetURL = "/api/products/" + id;
    try {
      await axios.get(targetURL);
    } catch (error) {
      setError("error retrieving products: " + error);
    }
    targetURL = "/api/cart/" + id;
    try {
      await axios.post(targetURL);
    } catch (error) {
      setError("error updating cart: " + error);
    }
    fetchCart();
  }

  // render results
  return (
    <div className="App">
      {error}
      <div className="ProductList">
        <h1>Products</h1>
        {products.map(item => (
          <div key={item.id} className="singleProduct">
            <p>{item.name}, {item.price} <button onClick={e => addToCart(item.id)}>Add to Cart</button></p>
          </div>
        ))}
      </div>
      <div className="CartList">
        <h1>Cart</h1>
        {cartItems.map(item => (
          <div key={item.id} className="singleCartItem">
            <p>{item.name}, {item.quantity} <button onClick={e => subtractItemQuantity(item.id)}>-</button> <button onClick={e => addItemQuantity(item.id)}>+</button> <button onClick={e => deleteCartItem(item.id)}>Remove from Cart</button></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
