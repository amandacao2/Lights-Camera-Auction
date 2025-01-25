import React, {useState, useEffect} from 'react';
import useWebSocket from 'react-use-websocket';

const Directory = () => {
    const [products, setProducts] = useState([]);
    const {sendMessag, lastMessage, readyState} = useWebSocket('ws://localhost:8765', {
        onOpen: () => console.log('opened'),
        onClose: () => console.log('closed'),
        onError: (event) => console.log('error', event),
        shouldReconnect: (closeEvent) => true,
        share: true
    });

    const getActualTimeLeft = (products) => {
        return products.map((product) => {
            const timeLeft = product.time_left;
            const creationTime = product.created_at;
            const time = Math.floor((new Date()).getTime() / 1000);
            console.log("created at"+ creationTime);
            console.log("current time"+ time);
            console.log("old time"+ timeLeft);
            product.time_left = timeLeft - (time - creationTime);
            console.log("new time"+ product.time_left);
            return product;
        });
    }

    useEffect(() => {
        if (lastMessage !== null) {
            const newProduct = JSON.parse(lastMessage.data);
            console.log("wow")
            console.log(newProduct);
            if (Array.isArray(newProduct)) {
                const updatedProducts = getActualTimeLeft(newProduct);
                setProducts(updatedProducts);
            } else {
                setProducts((prevProduct) => [...prevProduct, ...newProduct]);
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.time_left > 0
                        ? { ...product, time_left: product.time_left - 1 }
                        : product
                )
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    return (
        <div className='App'>
            {/* <form onSubmit={handleSubmit}>
                <input type="text" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} placeholder="Product Title" />
                <input type="text" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Product Description" />
                <input type="number" value={newProduct['starting_bid']} onChange={(e) => setNewProduct({...newProduct, 'starting_bid': e.target.value})} placeholder="Starting Bid" />
                <input type="number" value={newProduct['time_left']} onChange={(e) => setNewProduct({...newProduct, 'time_left': e.target.value})} placeholder="Countdown Timer" />
                <input type="number" value={newProduct['reserve']} onChange={(e) => setNewProduct({...newProduct, 'reserve': e.target.value})} placeholder="Reserve Bid" />
                <button type="submit">Add Product</button>
            </form> */}

            <h1>Product List</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.product_id}>
                        {product.title} - {product.description} - ${product['starting_bid']} - {formatTime(product['time_left'])}s - {product['bid']}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Directory;