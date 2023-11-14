import json 
from kafka import KafkaConsumer
import sqlite3
con = sqlite3.connect("messages.db")

if __name__ == '__main__':
    cur = con.cursor()
    # Kafka Consumer 
    try:
        cur.execute("CREATE TABLE messages(raw)")
    except:
        pass
    consumer = KafkaConsumer(
        'mec-xdr',
        bootstrap_servers='localhost:9092',
        max_poll_records = 100,
        value_deserializer=lambda m: json.loads(m.decode('ascii')),
        auto_offset_reset='earliest'#,'smallest'
    )
    for message in consumer:
        print(json.loads(message.value))
        # value = json.loads(message.value)["client_ip"]
        # cur.execute("INSERT INTO messages VALUES ("+value+")")
        # con.commit()