#!/usr/bin/python3

import json
import logging
import traceback

import httpx
import falcon.asgi
from falcon import media

from nf_server.services.data_transformer import standardize


json_handler = media.JSONHandler()
extra_handlers = {
    'application/json': json_handler,
}


class CORSMiddleware:
    async def process_request(self, req, resp):
        pass

    async def process_response(self, req, resp, resource, req_succeeded):
        resp.set_header('Access-Control-Allow-Origin', '*')
        resp.set_header('Access-Control-Allow-Methods',
                        'GET, POST, OPTIONS')
        resp.set_header('Access-Control-Allow-Headers',
                        'Authorization, Content-Type')


class ExceptionLoggingMiddleware:
    async def process_response(self, req, resp, resource, req_succeeded):
        if not req_succeeded:
            logging.error("Request failed", exc_info=True)


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
            query = 'kefir'

        resp.text = await self._fetch_usda_data(query)

    async def _fetch_usda_data(self, query: str):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://fdc.nal.usda.gov/portal-data/external/search",
                    json={
                        "includeDataTypes": {"SR Legacy": True},
                        "generalSearchInput": query,
                        "requireAllWords": True,
                        "pageNumber": 1,
                        "sortCriteria": {"sortColumn": "description", "sortDirection": "asc"}
                    }
                )
                raw_data = response.text
                standardized_data = standardize(raw_data)
                
                return standardized_data

        except Exception as e:
            print(traceback.format_exec())
            raise


app = falcon.asgi.App(middleware=[ExceptionLoggingMiddleware(), CORSMiddleware()])

app.add_route("/test-rest", USDASearchResource())
app.add_route("/search-test/{query}", USDASearchResource())
app.add_route('/', Counter())
