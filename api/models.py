from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime

from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, index=True)
    telephone = Column(String, unique=True, index=True)
    is_online = Column(Boolean, default=True)

    channels = relationship("Channel", back_populates="owner")

class Channel(Base):
    __tablename__ = "channels"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="channels")
