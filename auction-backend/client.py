import asyncio
import json
from websockets.asyncio.client import connect

async def client():
    async with connect("ws://localhost:8765") as websocket:
        new_item = {"title": "Item #1", "description": "This is item #1", "starting-bid": 1.50, "countdown-timer": 10}
        await websocket.send(json.dumps(new_item))
        try:
            while True:
                message = await websocket.recv()
                print("Received:", message)
        except Exception as e:
            print(f"Connection closed: {e}")

if __name__ == "__main__":
    asyncio.run(client())