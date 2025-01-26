import asyncio
import json
from websockets.asyncio.client import connect
import time

async def client():
    async with connect("ws://localhost:8765") as websocket:
        # Example: Creating a product
        new_item = await create_product(
            websocket,
            title="Item #3",
            description="This is item #3",
            starting_bid=50,
            time_left=3600,
            reserve=60
        )

        if new_item:
            # Simulate some delay before placing a bid
            await asyncio.sleep(3)  # Simulate a delay before placing a bid
            
            # Call the place_bid action when the "Place Bid" button is clicked
            await place_bid(websocket, product_id=new_item["product_id"], bidder_id="user2345", current_bid=new_item["starting_bid"])

        try:
            while True:
                message = await websocket.recv()
                data = json.loads(message)
                
                # Handle product updates from the server
                if "action" in data and data["action"] == "product_update":
                    current_bid = data.get("bid", 0)
                    current_bidder = data.get("bidder", None)
                    time_left = data.get("time_left", 0)
                    
                    # Check if the current client is outbid and notify
                    if current_bidder != "user234":
                        print(f"Outbid! The current highest bid for {data['title']} is {current_bid} by {current_bidder}.")
                    else:
                        print(f"You're currently the highest bidder for {data['title']} at {current_bid}.")
                
                print(f"Time left for {data['title']}: {time_left} seconds.")
                print("Received:", message)
        except Exception as e:
            print(f"Connection closed: {e}")


# Create a new product
async def create_product(websocket, title, description, starting_bid, time_left, reserve):
    new_item = {
        "action": "create_product",
        "seller_id": "user234",  # Dynamic seller ID
        "title": title,
        "description": description,
        "image_url": "https://example.com/item3.jpg",  # Example URL
        "starting_bid": starting_bid,
        "time_left": time_left,
        "reserve": reserve,
    }

    print(f"Attempting to create product: {new_item}")
    await websocket.send(json.dumps(new_item))

    while True:
        # Wait for a valid response
        server_response = await websocket.recv()
        response = json.loads(server_response)

        # Debugging: Print the full server response
        print(f"Server response: {response}")

        # Check if the response is a list (which it is)
        if isinstance(response, dict) and "product" in response:
            # Look for the newly created product by matching its title or other attributes
            # for product in response:
            product = response["product"]
            if product["title"] == title and product["seller_id"] == "user23544":
                print(f"Product created with ID: {product['product_id']}")
                return product

        # If we receive a product that matches the newly created one, return it
        print("Waiting for the correct product response...")

    print("Error: Failed to receive the created product response.")
    return None



# Sending a bid from the client
async def place_bid(websocket, product_id, bidder_id, current_bid):
    new_bid = current_bid + 5  # Increment the bid
    bid_data = {
        "action": "place_bid",
        "product_id": product_id,
        "bid_amount": new_bid,
        "bidder": bidder_id
    }
    print(f"Attempting to place bid: {bid_data}")
    await websocket.send(json.dumps(bid_data))
    print(f"Placed bid of {new_bid} on product {product_id}. ")


if __name__ == "__main__":
    print("Client2 started.")
    asyncio.run(client())

