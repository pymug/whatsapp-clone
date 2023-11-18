import redis

# initializing the redis instance
r = redis.Redis(
    host='127.0.0.1',
    port=6379,
    decode_responses=True # <-- this will ensure that binary data is decoded
)

while True:
    message = input("Enter the message you want to send to soilders: ")

    r.publish("army-camp-1", message)