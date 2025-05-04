from pymongo import MongoClient
import pandas as pd
from datetime import datetime

# Connect to MongoDB with error handling
try:
    #change port if it is different in your computer 
    client = MongoClient("mongodb://localhost:27017")
    client.server_info()  # Force test of the connection
    print("✅ MongoDB connection established successfully.")
except Exception as e:
    print("❌ MongoDB connection failed:", e)
    exit()

# Database and collections
db = client["alg_dialect_hate"]
hate_collection = db["hate_collection"]
offensiveness_collection = db["offensiveness_collection"]
category_collection = db["category_collection"]
level_collection = db["level_collection"]


def addHate(data):
    try:
        insertion = {
            "comment": data["inputText"],
            "hate_speech": 1 if data["correctIsHate"] else 0,
            "timestamp": datetime.now(),
            "origin": "user_submission"
        }
        result = hate_collection.insert_one(insertion)
        print("✅ Hate inserted:", result.inserted_id)
    except Exception as e:
        print("❌ Failed to insert hate:", e)

def addOffensiveness(data):
    try:
        insertion = {
            "comment": data["inputText"],
            "offensiveness": 1 if data["correctIsOffensive"] else 0,
            "timestamp": datetime.now(),
            "origin": "user_submission"
        }
        result = offensiveness_collection.insert_one(insertion)
        print("✅ Offensiveness inserted:", result.inserted_id)
    except Exception as e:
        print("❌ Failed to insert offensiveness:", e)

def addCategory(data):
    try:
        insertion = {
            "comment": data["inputText"],
            "hate_category": data["correctHateType"],
            "timestamp": datetime.now(),
            "origin": "user_submission"
        }
        result = category_collection.insert_one(insertion)
        print("✅ Category inserted:", result.inserted_id)
    except Exception as e:
        print("❌ Failed to insert category:", e)

def addLevel(data):
    try:
        insertion = {
            "comment": data["inputText"],
            "hate_level": data["correctHateLevel"],
            "timestamp": datetime.now(),
            "origin": "user_submission"
        }
        result = level_collection.insert_one(insertion)
        print("✅ Level inserted:", result.inserted_id)
    except Exception as e:
        print("❌ Failed to insert level:", e)

def addData(data):
    addHate(data)
    addOffensiveness(data)
    addCategory(data)
    addLevel(data)

print("MongoDB connection established successfully.")
