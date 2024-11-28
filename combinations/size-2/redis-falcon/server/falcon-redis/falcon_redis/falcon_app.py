import falcon.asgi
import redis
import json
import logging
import traceback

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ErrorHandler:
    def __init__(self):
        pass

    async def handle(self, req, resp, ex, *args, **kwargs):
        logger.error(f'Exception occurred: {str(ex)}')
        logger.error(traceback.format_exc())
        resp.status = falcon.HTTP_500
        resp.media = {
            'error': 'Internal server error',
            'message': str(ex)
        }

# Connect to Redis
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)



# Resource to handle data
class DataResource:
    async def on_post(self, req, resp):
        """Insert new data into Redis"""
        try:
            print('getting data')
            data = await req.media  # Expecting a JSON body
            print('got data')
            print('setting db values')
            for key, value in data.items():
                print(f'about to set {key} as {value}')
                redis_client.set(key, value)
                print(f'just set {key} as {value}')
            print('db values set')
            print('returning')
            resp.media = {"status": "Data added", "data": data}
        except Exception as e:
            logger.error(f"Error processing request: {str(e)}", exc_info=True)
            raise


    async def on_get(self, req, resp):
        """Retrieve all keys and their values from Redis"""
        keys = redis_client.keys("*")
        all_data = {key: redis_client.get(key) for key in keys}
        resp.media = all_data

# Resource to show specific data
class ShowResource:
    async def on_get(self, req, resp, key):
        """Retrieve a specific key from Redis"""
        value = await redis_client.get(key)
        resp.media = {key: value} if value else {"error": "Key not found"}

# Falcon app
app = falcon.asgi.App()

app.add_error_handler(Exception, ErrorHandler().handle)

# Add routes
app.add_route('/data', DataResource())
app.add_route('/data/{key}', ShowResource())
