import { useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import useWebSocket from 'react-use-websocket';

const Product = () => {
    const location = useLocation();
    const [product, setProduct] = useState(location.state);
    const {sendMessage, lastMessage, readyState} = useWebSocket('ws://localhost:8765', {
        onOpen: () => console.log('opened'),
        onClose: () => console.log('closed'),
        onError: (event) => console.log('error', event),
        shouldReconnect: (closeEvent) => true,
        share: true
    });

    useEffect(() => {
        if (lastMessage !== null) {
            console.log(lastMessage.data);
            const newProduct = JSON.parse(lastMessage.data);
            console.log("wow")
            console.log(newProduct);
            if (Array.isArray(newProduct)) {
                return;
            } else {
                if (newProduct.hasOwnProperty('product')) {
                    return;
                }
                else {
                    setProduct((prevProduct) => {
                        if (prevProduct.id === newProduct.id) {
                            if (newProduct.hasOwnProperty('failure_message')) {
                                alert('Bid is not high enough');
                                return prevProduct;
                            }
                            return {...prevProduct, bid: newProduct.bid};
                        } else {
                            return prevProduct;
                        }
                    });
                }
            }
        }
    }, [lastMessage]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    const [newBid, setNewBid] = useState(() => {
        if (product.bid >= product.starting_bid) {
            return product.bid;
        } else {
            return product.starting_bid;
        }
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setProduct(prevProduct => ({
                ...prevProduct,
                time_left: prevProduct.time_left > 0 ? prevProduct.time_left - 1 : 0
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = () => {
        console.log(newBid);
        const bid = {
            product_id: product.id,
            bid_amount: newBid,
            bidder: localStorage.getItem("uid"),
            action: "place_bid"
        }
        sendMessage(JSON.stringify(bid));
    }
    return (
        <div>
            <h1>{product.title}</h1>
            <div>
                <button onClick={() => setNewBid(prevNewBid => prevNewBid + 5)}>Increase</button>
                <button onClick={() => setNewBid(prevNewBid => (prevNewBid > product.starting_bid ? prevNewBid - 5 : product.starting_bid))}>Decrease</button>
            </div>
            <p>{product.description}</p>
            <p>{product['starting_bid']}</p>
            <p>{formatTime(product['time_left'])}</p>
            <p>{product['bid']}</p>
            <p>New Bid: {newBid}</p>
            <button onClick={handleSubmit}>Submit Bid</button>
        </div>
    )
}

export default Product