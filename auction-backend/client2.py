import asyncio
import json
from websockets.asyncio.client import connect

async def client():
    async with connect("ws://localhost:8765") as websocket:
        new_item = {"title": "Item #2", "description": "This is item #2", "starting-bid": 3.50, "countdown-timer": 12}
        await websocket.send(json.dumps(new_item))
        try:
            while True:
                message = await websocket.recv()
                print("Received:", message)
        except Exception as e:
            print(f"Connection closed: {e}")

if __name__ == "__main__":
    asyncio.run(client())