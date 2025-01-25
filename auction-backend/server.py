import asyncio
import json
from websockets.asyncio.server import serve
import time

from google.cloud import firestore
from google.oauth2.service_account import Credentials

# Firebase setup
SDK_KEY_FILE = "SDK_Key_Firebase.json"
credentials = Credentials.from_service_account_file(SDK_KEY_FILE)
db = firestore.Client(credentials=credentials)
COLLECTION_NAME = "products"

connected_clients = set()

# Send all products to the connected client
async def send_all_products(websocket):
    try:
        products = db.collection(COLLECTION_NAME).stream()
        all_products = [{**doc.to_dict(), "id": doc.id} for doc in products]
        await websocket.send(json.dumps(all_products))
    except Exception as e:
        print(f"Error sending products: {e}")

# Broadcast message to all connected clients
async def broadcast(message):
    for client in connected_clients:
        try:
            await client.send(message)
        except Exception as e:
            print(f"Error broadcasting to a client: {e}")

# Main WebSocket server that handles different actions
async def handle_client(websocket):
    connected_clients.add(websocket)
    try:
        # Send the list of all products to the connected client
        await send_all_products(websocket)

        async for message in websocket:
            new_data = json.loads(message)

            # Distinguish between actions
            if "action" in new_data:
                action = new_data["action"]
                print(f"Received action: {action} at {int(time.time())}")

                if action == "create_product":
                    # Validate seller's perspective using their UUID
                    seller_id = new_data.get("seller_id")  # Ensure seller_id is sent
                    if seller_id:
                        product_data = {
                            "title": new_data["title"],
                            "description": new_data["description"],
                            "image_url": new_data["image_url"],
                            "starting_bid": new_data["starting_bid"],
                            "time_left": new_data["time_left"],
                            "reserve": new_data["reserve"],
                            "bid": 0,   # Initial bid equals starting_bid
                            "bidder": None,
                            "bid_timestamp": None,
                            "created_at": int(time.time()),
                            "status": "active",
                            "seller_id": seller_id  # Track which seller added the product
                        }

                        # Add the product to Firestore
                        _, doc_ref = db.collection(COLLECTION_NAME).add(product_data)
                        product_data["product_id"] = doc_ref.id  # Include Firestore's document ID

                        # Broadcast the new product to all clients
                        await broadcast(json.dumps({"action": "create_product", "product": product_data}))
                        print(f"Product {product_data['product_id']} created successfully.")
                    else:
                        print("Error: Missing seller_id in product creation request.")

                elif action == "place_bid":
                    # Handle bid placement
                    product_id = new_data["product_id"]
                    new_bid = new_data["bid_amount"]
                    bidder = new_data["bidder"]
                    timestamp = int(time.time())  # Current UNIX timestamp

                    # Query Firestore for the product
                    product_ref = db.collection(COLLECTION_NAME).document(product_id)
                    products = product_ref.get()
                    
                    if products.exists:
                        product_data = products.to_dict()
                        current_bid = product_data.get("bid", 0)
                        previous_bidder = product_data.get("bidder", None)
                        # product_document_ref = db.collection(COLLECTION_NAME).document(product_data['product_id'])
                            # Prevent the seller from bidding on their own product
                        if bidder == product_data["seller_id"]:
                            print("Error: Seller cannot bid on their own product.")
                            continue

                            # Check if the new bid is higher than the current bid
                        if new_bid > current_bid:
                            # Update Firestore with the new bid
                            product_ref.update({
                                "bid": new_bid,
                                "bidder": bidder,
                                "bid_timestamp": timestamp
                            })

                                # Prepare data to broadcast
                            product_data["bid"] = new_bid
                            product_data["bidder"] = bidder
                            product_data["bid_timestamp"] = timestamp
                            product_data["id"] = product_id
                            product_data["previous_bidder"] = previous_bidder

                                # Broadcast the updated product data to all clients
                            await broadcast(json.dumps(product_data))
                            print(f"Bid of {new_bid} placed on product {product_id}.")
                        else:
                            print(f"Error: Bid {new_bid} is not higher than the current bid {current_bid}.")
                    else:
                        print(f"Error: Product with ID {product_id} does not exist.")
            else:
                print("Error: Invalid message format received.")

    except Exception as e:
        print(f"Error handling client: {e}")
    finally:
        connected_clients.remove(websocket)

# Main function to start the WebSocket server
async def main():
    async with serve(handle_client, "localhost", 8765):
        print("Server started.")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
