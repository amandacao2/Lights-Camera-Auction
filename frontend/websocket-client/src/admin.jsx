import React, {useState, useEffect} from 'react';
import useWebSocket from 'react-use-websocket';
import './admin.css';

function Admin() {
  const [newProduct, setNewProduct] = useState({"title": "", "description": "", "starting_bid": 0, "time_left": 0, "reserve": 0, "spline_url": ""});
  const {sendMessage, lastMessage, readyState} = useWebSocket('ws://localhost:8765', {
    onOpen: () => console.log('opened'),
    onClose: () => console.log('closed'),
    onError: (event) => console.log('error', event),
    shouldReconnect: (closeEvent) => true,
    share: true
  });

  const handleSubmit = (e) => {
    console.log("SUBMITTING");
    e.preventDefault();

    if (newProduct.title && newProduct.description && newProduct['starting_bid'] && newProduct['time_left']) {
      console.log("Valid Product");
      const productToSend = {
        ...newProduct,
        "action": "create_product",
        "seller_id": localStorage.getItem("uid"),
        "image_url": "https://example.com/item3.jpg",
        "starting_bid": parseFloat(newProduct['starting_bid']),
        "time_left": parseInt(newProduct['time_left']),
        "reserve": parseFloat(newProduct['reserve'])
      }
      if (readyState === 1) {
        console.log("READY TO SEND");
        sendMessage(JSON.stringify(productToSend));
        setNewProduct({"title": "", "description": "", "starting_bid": 0, "time_left": 0, "reserve": 0, "spline_url": ""});
      }
    }
  }

    return (
        <div className='admin-container'>
            <h1 className='admin-title'>Create Product</h1>
            <div className='admin-form-container'>
              <form className='admin-form' onSubmit={handleSubmit}>
                <label htmlFor='title'>Title:</label>
                <input type="text" id='title' name='title' required value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} placeholder="Product Title" />
                <label htmlFor='description'>Description:</label>
                <input type="text" id='description' name='description' required value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Product Description" />
                <label htmlFor='starting_bid'>Starting Bid:</label>
                <input type="number" id='starting_bid' name='starting_bid' required value={newProduct['starting_bid']} onChange={(e) => setNewProduct({...newProduct, 'starting_bid': e.target.value})} placeholder="Starting Bid" />
                <label htmlFor='time_left'>Time Left:</label>
                <input type="number" id='time_left' name='time_left' required value={newProduct['time_left']} onChange={(e) => setNewProduct({...newProduct, 'time_left': e.target.value})} placeholder="Countdown Timer" />
                <label htmlFor='reserve'>Reserve Bid:</label>
                <input type="number" id='reserve' name='reserve' required value={newProduct['reserve']} onChange={(e) => setNewProduct({...newProduct, 'reserve': e.target.value})} placeholder="Reserve Bid" />
                <label htmlFor='spline_url'>Spline URL:</label>
                <input type="text" id='spline_url' name='spline_url' required value={newProduct['spline_url']} onChange={(e) => setNewProduct({...newProduct, 'spline_url': e.target.value})} placeholder="Spline URL" />
                <button className='btn-submit' type="submit">Add Product</button>
              </form>
            </div>
        </div>
    )
}

export default Admin;