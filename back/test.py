from pymongo import MongoClient
import pandas as pd
from datetime import datetime

# Connect to MongoDB with error handling
try:
    client = MongoClient("mongodb+srv://bamjed86:Inh2y6xZHhUjcpVR@cluster0.mssna5g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
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

# Deleting all documents with origin "user_submission"
offensiveness_collection.delete_many({ "origin": "user_submission" })
hate_collection.delete_many({ "origin": "user_submission" })
category_collection.delete_many({ "origin": "user_submission" })
level_collection.delete_many({ "origin": "user_submission" })

print("✅ All user-submitted documents deleted successfully.")
