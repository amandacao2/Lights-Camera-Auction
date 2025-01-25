import asyncio
import json
from websockets.asyncio.server import serve
from pathlib import Path

from google.cloud import firestore
from google.oauth2.service_account import Credentials


SDK_KEY_FILE = "SDK_KEY_Firebase.json"
credentials = Credentials.from_service_account_file(SDK_KEY_FILE)
db = firestore.Client(credentials=credentials)
COLLECTION_NAME = "products"


connected_clients = set()


# def load_json_data():
#     if JSON_FILE_PATH.exists():
#         with JSON_FILE_PATH.open('r') as f:
#             try:
#                 return json.load(f)
#             except json.JSONDecodeError:
#                 return []
            
# def save_json_data(data):
#     with JSON_FILE_PATH.open('w') as f:
#         json.dump(data, f)

async def send_all_products(websocket):
    try:
        products = db.collection(COLLECTION_NAME).stream()
        all_products = [{**doc.to_dict(), "id": doc.id} for doc in products]

        await websocket.send(json.dumps(all_products))
    except Exception as e:
        print(f"Error: {e}")

async def broadcast(message):
    for client in connected_clients:
        try:
            await client.send(message)
        except Exception:
            pass

async def handle_client(websocket):
    connected_clients.add(websocket)


    try:

        await send_all_products(websocket)

        async for message in websocket:
            new_data = json.loads(message)

            # current_data = load_json_data()

            # current_data.append(new_data)
            # save_json_data(current_data)

            _, doc_ref = db.collection(COLLECTION_NAME).add(new_data)

            new_data["id"] = doc_ref.id
            await broadcast(json.dumps(new_data))
    except Exception as e:
        print(f"Error: {e}")
    finally:
        connected_clients.remove(websocket)    


async def main():
    async with serve(handle_client, "localhost", 8765) as server:
        await server.serve_forever()



if __name__ == "__main__":
    asyncio.run(main())