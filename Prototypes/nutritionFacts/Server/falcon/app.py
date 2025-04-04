#!/usr/local/bin/python3

# app.py
import falcon.asgi
from falcon import media

class Counter:
    def __init__(self):
        self.count = 0

    async def on_get(self, req, resp):
        """Increment the counter."""
        self.count += 1
        resp.media = {'count': self.count}

class Basic_API_PoC:
    def __init__(self):
        pass

    async def on_get(self, req, resp):
        print(resp)
        print(dir(resp))




app = falcon.asgi.App()

counter = Counter()
app.add_route('/', counter)

poc = POC()
app.add_route('/test', poc)
