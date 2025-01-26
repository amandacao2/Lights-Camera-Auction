import React, {useState, useEffect} from 'react';
import useWebSocket from 'react-use-websocket';
import {Link} from 'react-router-dom';

const Directory = () => {
    const [products, setProducts] = useState([]);
    const {sendMessage, lastMessage, readyState} = useWebSocket('ws://localhost:8765', {
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
                if (newProduct.hasOwnProperty('product')) {
                    const defNewProduct = newProduct.product;
                    // defNewProduct.id = defNewProduct.product_id;
                    setProducts((prevProduct) => [...prevProduct, defNewProduct]);
                }
                else {
                    if (newProduct.hasOwnProperty('action')) {
                        if (newProduct.action === 'delete_item') {
                            if (newProduct.message === 'Reserve') {
                                alert("Reserve bid not met for " + newProduct.title);
                            }
                            console.log('deletting')
                            setProducts((prevProducts) => prevProducts.filter((product) => (product.id !== newProduct.product_id) && (product.product_id !== newProduct.product_id)));
                            console.log(products);
                        }
                        else if(newProduct.action === 'win_item') {
                            if (newProduct.bidder === localStorage.getItem("uid")) {
                                alert("You have won " + newProduct.title  + " for " + newProduct.price);
                            }
                            setProducts((prevProducts) => prevProducts.filter((product) => (product.id !== newProduct.product_id) && (product.product_id !== newProduct.product_id)));
                            console.log(products);
                        }
                    }
                    setProducts((prevProducts) => {
                        const updatedProducts = prevProducts.map((product) => {
                            if (product.id === newProduct.id) {
                                return {...product, bid: newProduct.bid};
                            } else {
                                return product;
                            }
                        });
                        return updatedProducts;
                    });
                    if (newProduct.previous_bidder == localStorage.getItem("uid")) {
                        alert("You have been outbid on " + newProduct.title);
                    }
                }
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
            <h1>Product List</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <Link to={`/product/${product.id}`} state={product}>
                            {product.title} - {product.description} - ${product['starting_bid']} - {formatTime(product['time_left'])}s - {product['bid']}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Directory;