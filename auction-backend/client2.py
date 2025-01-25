import asyncio
import json
from websockets.asyncio.client import connect
import time

async def client():
    async with connect("ws://localhost:8765") as websocket:
        # Example: Calling the create product action when the button is clicked
        new_item = await create_product(
            websocket,
            title="Item #3",
            description="This is item #3",
            starting_bid=50,
            minimum_bid=50,  # Fixed the missing argument
            time_left=3600,
            reserve=60
        )

        # Simulate some delay before placing a bid
        await asyncio.sleep(3) # Simulate a delay before placing a bid
        
        # Call the place_bid action when the "Place Bid" button is clicked
        await place_bid(websocket, product_id=new_item["product_id"], bidder_id="user234", current_bid=new_item["minimum_bid"])

        try:
            while True:
                message = await websocket.recv()
                data = json.loads(message)
                
                # Handle the response for a product update (when the bid changes)
                if "action" in data and data["action"] == "product_update":
                    current_bid = data.get("bid", 0)
                    current_bidder = data.get("bidder", None)
                    
                    # Check if the current client is outbid and notify
                    if current_bidder != "user456":
                        print(f"Outbid! The current highest bid for {data['title']} is {current_bid} by {current_bidder}.")
                    else:
                        print(f"You're currently the highest bidder for {data['title']} at {current_bid}.")
                
                print("Received:", message)
        except Exception as e:
            print(f"Connection closed: {e}")


# Create product with input from frontend
async def create_product(websocket, title, description, minimum_bid, starting_bid, time_left, reserve):
    new_item = {
        "action": "create_product",  # Action to create a new product
        "seller_id": "user234",  # Seller's ID (can be dynamic)
        "product_id": f"product{str(int(time.time()))}",  # Ensure unique product ID (using timestamp)
        "title": title,
        "description": description,
        "image_url": "https://example.com/item3.jpg",  # Example image URL (can be dynamic)
        "minimum_bid": minimum_bid,
        "starting_bid": starting_bid,
        "time_left": time_left,
        "reserve": reserve
    }

    print(f"Attempting to create product: {new_item}")
    await websocket.send(json.dumps(new_item))

    return new_item  # Return the product ID for use in the next steps


# Sending a bid from the client
async def place_bid(websocket, product_id, bidder_id, current_bid):
    new_bid = current_bid + 5  # Increment the bid
    bid_data = {
        "action": "place_bid",
        "product_id": product_id,
        "bid_amount": new_bid,
        "bidder": bidder_id,
    }
    print(f"Attempting to place bid: {bid_data}")
    await websocket.send(json.dumps(bid_data))
    print(f"Placed bid of {new_bid} on product {product_id}")



if __name__ == "__main__":
    print("Client2 started.")
    asyncio.run(client())
