import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import "./product.css";

const Product = () => {
  const location = useLocation();
  const [product, setProduct] = useState(location.state);
  const { sendMessage, lastMessage } = useWebSocket("ws://localhost:8765", {
    onOpen: () => console.log("WebSocket opened"),
    onClose: () => console.log("WebSocket closed"),
    onError: (event) => console.error("WebSocket error:", event),
    shouldReconnect: () => true,
    share: true,
  });

  const [newBid, setNewBid] = useState(() => {
    return product.bid >= product.starting_bid ? product.bid : product.starting_bid;
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const newProduct = JSON.parse(lastMessage.data);
      if (!Array.isArray(newProduct) && !newProduct.hasOwnProperty("product")) {
        setProduct((prevProduct) => {
          if (prevProduct.id === newProduct.id) {
            if (newProduct.hasOwnProperty("failure_message")) {
              alert("Bid is not high enough");
              return prevProduct;
            }
            return { ...prevProduct, bid: newProduct.bid };
          }
          return prevProduct;
        });
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProduct((prevProduct) => ({
        ...prevProduct,
        time_left: prevProduct.time_left > 0 ? prevProduct.time_left - 1 : 0,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    const bid = {
      product_id: product.id,
      bid_amount: newBid,
      bidder: localStorage.getItem("uid"),
      action: "place_bid",
    };
    sendMessage(JSON.stringify(bid));
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div>
      <div className="title-container">
        <h1 className="product-title">{product.title}</h1>
        <h2 className="product-timer">{formatTime(product.time_left)}</h2>
      </div>
      <div className="main-container">
        <spline-viewer url={product.spline_url}></spline-viewer>
        <div className="bidding-container">
          <div>
            <p className="product-text">
              <strong>Description:</strong> {product.description}
            </p>
            <p className="product-text">
              <strong>Starting Bid:</strong> ${product.starting_bid}
            </p>
            <p className="product-text">
              <strong>Current Bid:</strong> ${product.bid}
            </p>
            <div className="new-bid-container">
              <label htmlFor="newBid" className="bid-label">
                New Bid:
              </label>
              <div className="bid-controls">
                <button
                  className="btn-submit"
                  onClick={() =>
                    setNewBid((prev) =>
                      prev > product.starting_bid ? prev - 5 : product.starting_bid
                    )
                  }
                >
                  -
                </button>
                <input
                  id="newBid"
                  type="text"
                  className="bid-input"
                  value={newBid}
                  readOnly
                />
                <button
                  className="btn-submit"
                  onClick={() => setNewBid((prev) => prev + 5)}
                >
                  +
                </button>
              </div>
              <button className="btn-submit" onClick={handleSubmit}>
                Submit Bid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
