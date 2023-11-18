from fastapi import FastAPI, HTTPException, Depends
import models
from pydantic import BaseModel, Field
from database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

class User(BaseModel):
    telephone: int
    name: str

class Channel(BaseModel):
    title: str

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

@app.get("/users", tags=["User"])
# Get all users
async def getUsers(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.get("/users/{user_id}", tags=["User"])
# Retrieve a specific user
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    return user

@app.post("/users", tags=["User"])
# Create a user
async def create_user(user: User, db: Session = Depends(get_db)):
    user_model = models.User()
    user_model.telephone = user.telephone
    user_model.name = user.name
    
    db.add(user_model)
    db.commit()
    
    return user

@app.put("/users/{user_id}", tags=["User"])
async def updateUser(user_id: int, user: User, db: Session = Depends(get_db)):
    user_model = db.query(models.User).filter(models.User.id == user_id).first()

    if user_model is None:
        raise HTTPException(
            status_code=404,
            detail=f"ID {user_id} : User does not exist"
        )

    user_model.telephone = user.telephone
    user_model.name = user.name

    db.add(user_model)
    db.commit()

    return user

@app.delete("/users/{user_id}", tags=["User"])
async def deleteUser(user_id: int, db: Session = Depends(get_db)):
    user_model = db.query(models.User).filter(models.User.id == user_id).first()

    if user_model is None:
        raise HTTPException(
            status_code=404,
            detail=f"ID {user_id} : User does not exist"
        )

    db.query(models.User).filter(models.User.id == user_id).delete()
    db.commit()

@app.get("/chats", tags=["Chat"])
# Get all users
async def getChats(db: Session = Depends(get_db)):
    chats = db.query(models.Chat).filter(models.Chat.owner_id == 1).all()
    return db.query(models.Chat).all()

@app.get("/channels", tags=["Channel"])
# Get all channels
async def getChannels(db: Session = Depends(get_db)):
    channels = db.query(models.Channel).all()
    return channels

@app.post("/channels", tags=["Channel"])
# Create a channel
async def create_channel(channel: Channel, db: Session = Depends(get_db)):
    channel_model = models.Channel()
    channel_model.title = channel.title
    
    db.add(channel_model)
    db.commit()
    
    return channel

@app.get("/channels/{channel_id}", tags=["Channel"])
# Retrieve a channel
async def get_channel(channel_id: int, db: Session = Depends(get_db)):
    channel = db.query(models.Channel).filter(models.Channel.id == channel_id).first()
    return channel