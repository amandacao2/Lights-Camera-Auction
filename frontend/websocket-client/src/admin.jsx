import React, {useState, useEffect} from 'react';
import useWebSocket from 'react-use-websocket';

function Admin() {
  const [newProduct, setNewProduct] = useState({"title": "", "description": "", "starting_bid": 0, "time_left": 0, "reserve": 0});
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
      }
      if (readyState === 1) {
        console.log("READY TO SEND");
        sendMessage(JSON.stringify(productToSend));
        setNewProduct({"title": "", "description": "", "starting_bid": 0, "time_left": 0, "reserve": 0});
      }
    }
  }

    return (
        <div className='App'>
            <h1>Create Product</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} placeholder="Product Title" />
                <input type="text" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Product Description" />
                <input type="number" value={newProduct['starting_bid']} onChange={(e) => setNewProduct({...newProduct, 'starting_bid': e.target.value})} placeholder="Starting Bid" />
                <input type="number" value={newProduct['time_left']} onChange={(e) => setNewProduct({...newProduct, 'time_left': e.target.value})} placeholder="Countdown Timer" />
                <input type="number" value={newProduct['reserve']} onChange={(e) => setNewProduct({...newProduct, 'reserve': e.target.value})} placeholder="Reserve Bid" />
                <button type="submit">Add Product</button>
            </form>
        </div>
    )
}

export default Admin;