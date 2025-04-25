#!/usr/bin/python3

import falcon.asgi
import httpx
import json
from falcon import media

json_handler = media.JSONHandler()
extra_handlers = {
    'application/json': json_handler,
}

class Counter:
    def __init__(self):
        self.count = 0

    async def on_get(self, req, resp):
        """Increment the counter."""
        self.count += 1
        resp.media = {'count': self.count}

    async def on_head(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.text = 'Alive!'

class USDASearchResource:

    async def on_get(self, req, resp, query=None):
        print('on get', query)
        if not query:
            resp.text = await self._fetch_usda_data("kefir")
        else:
            resp.text = await self._fetch_usda_data(query)

    async def _fetch_usda_data(self, query: str):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://fdc.nal.usda.gov/portal-data/external/search",
                headers={
#                    "Accept": "application/json, text/plain, */*",
#                    "Accept-Language": "en-US,en;q=0.9",
#                    "Content-Type": "application/json",
#                    "Referer": f"https://fdc.nal.usda.gov/food-search?query={query}&type=SR%20Legacy",
#                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
                },
                json={
                    "includeDataTypes": {"SR Legacy": True},
                    "generalSearchInput": query,
                    "requireAllWords": True,
                    "pageNumber": 1,
                    "sortCriteria": {"sortColumn": "description", "sortDirection": "asc"}
                }
            )

            return response.text


app = falcon.asgi.App()

app.add_route("/test-rest", USDASearchResource())
app.add_route("/search-test/{query}", USDASearchResource())
app.add_route('/', Counter())
