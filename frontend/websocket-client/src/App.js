import React, {useState, useEffect} from 'react';
import useWebSocket from 'react-use-websocket';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({"title": "", "description": "", "starting-bid": '', "countdown-timer": ''});
  const {sendMessage, lastMessage, readyState} = useWebSocket('ws://localhost:8765', {
    onOpen: () => console.log('opened'),
    onClose: () => console.log('closed'),
    onError: (event) => console.log('error', event),
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const newProduct = JSON.parse(lastMessage.data);
      console.log(newProduct);
      setProducts((prevProduct) => [...prevProduct, newProduct]);
    }
  }, [lastMessage]);

  const handleSubmit = (e) => {
    console.log("SUBMITTING");
    e.preventDefault();

    if (newProduct.title && newProduct.description && newProduct['starting-bid'] && newProduct['countdown-timer']) {
      console.log("Valid Product");
      const productToSend = {
        ...newProduct,
        "starting-bid": parseFloat(newProduct['starting-bid']),
        "countdown-timer": parseInt(newProduct['countdown-timer']),
      }
      if (readyState === 1) {
        console.log("READY TO SEND");
        sendMessage(JSON.stringify(productToSend));
        setNewProduct({"title": "", "description": "", "starting-bid": 0, "countdown-timer": 0});
      }
    }
  }
  
  return (
    <div className='App'>

      <form onSubmit={handleSubmit}>
        <input type="text" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} placeholder="Product Title" />
        <input type="text" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Product Description" />
        <input type="number" value={newProduct['starting-bid']} onChange={(e) => setNewProduct({...newProduct, 'starting-bid': e.target.value})} placeholder="Starting Bid" />
        <input type="number" value={newProduct['countdown-timer']} onChange={(e) => setNewProduct({...newProduct, 'countdown-timer': e.target.value})} placeholder="Countdown Timer" />
        <button type="submit">Add Product</button>
      </form>

      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.title} - ${product['starting-bid']}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App;