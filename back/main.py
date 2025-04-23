from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from models import PredictionResponse, CorrectionData
from final_model import model
from mongo import addCategory, addHate, addLevel, addOffensiveness

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

corrections_store = []

@app.get("/predict", response_model=PredictionResponse)
def predict(inputText: str = Query(..., min_length=1)):
    print('inputText : ', inputText)
    prediction = model(inputText)
    return prediction

@app.post("/correct")
def save_correction(data: CorrectionData):
    insertion = data.dict()
    corrections_store.append(insertion)
    addHate(insertion)
    addOffensiveness(insertion)
    addLevel(insertion)
    addCategory(insertion)
    
    return {"message": "Correction saved successfully"}
