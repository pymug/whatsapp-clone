import redis

# initializing the redis instance
r = redis.Redis(
    host='127.0.0.1',
    port=6379,
    decode_responses=True # <-- this will ensure that binary data is decoded
)

mobile = r.pubsub()

mobile.subscribe('army-camp-1')

for message in mobile.listen():
    print(message)