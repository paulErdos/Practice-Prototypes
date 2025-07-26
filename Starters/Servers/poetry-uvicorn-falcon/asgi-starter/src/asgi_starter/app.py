#!/usr/bin/python3

import falcon.asgi
from falcon import media

class Counter:
    def __init__(self):
        self.count = 0

    async def on_get(self, req, resp):
        """Increment the counter."""
        self.count += 1
        resp.media = {'count': self.count}


app = falcon.asgi.App()
counter = Counter()
app.add_route('/', counter)
