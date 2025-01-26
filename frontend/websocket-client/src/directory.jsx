import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { Link } from 'react-router-dom';
import './directory.css'; // Make sure the CSS file is imported

const Directory = () => {
    const [products, setProducts] = useState([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8765', {
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
            product.time_left = timeLeft - (time - creationTime);
            return product;
        });
    };

    useEffect(() => {
        if (lastMessage !== null) {
            const newProduct = JSON.parse(lastMessage.data);
            if (Array.isArray(newProduct)) {
                const updatedProducts = getActualTimeLeft(newProduct);
                setProducts(updatedProducts);
            } else {
                if (newProduct.hasOwnProperty('product')) {
                    const defNewProduct = newProduct.product;
                    setProducts((prevProduct) => [...prevProduct, defNewProduct]);
                } else {
                    if (newProduct.hasOwnProperty('action')) {
                        if (newProduct.action === 'delete_item') {
                            if (newProduct.message === 'Reserve') {
                                alert("Reserve bid not met for " + newProduct.title);
                            }
                            console.log('deletting')
                            setProducts((prevProducts) => prevProducts.filter((product) => (product.id !== newProduct.product_id) && (product.product_id !== newProduct.product_id)));
                        } else if (newProduct.action === 'win_item') {
                            if (newProduct.bidder === localStorage.getItem("uid")) {
                                alert("You have won " + newProduct.title + " for " + newProduct.price);
                            }
                            setProducts((prevProducts) => prevProducts.filter((product) => (product.id !== newProduct.product_id) && (product.product_id !== newProduct.product_id)));
                        }
                    }
                    setProducts((prevProducts) => {
                        const updatedProducts = prevProducts.map((product) => {
                            if (product.id === newProduct.id) {
                                return { ...product, bid: newProduct.bid };
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
    };

    return (
        <div className="directory-page">
            <header className="directory-header">
                <h1 className="directory-title">Product List</h1>
                <spline-viewer className="spline-logo" url="https://prod.spline.design/WTjmAoC6NwBs-UOB/scene.splinecode"></spline-viewer>
            </header>
            <main className="directory-main">
                <div className="product-images-container">
                    {products.slice(0, 4).map((product, index) => (
                        <div key={product.id} className="product-image-card">
                            <Link to={`/product/${product.id}`} state={product} className="product-image-link">
                            <spline-viewer url={product.spline_url}></spline-viewer>
                                <div className="product-image-overlay">
                                    <h3 className="product-title">{product.title}</h3>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Directory;
