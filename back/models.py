from pydantic import BaseModel

class PredictionResponse(BaseModel):
    isHate: bool
    hateType: str
    isOffensive: bool
    hateLevel: str
    hateSeverity: int
    inputText: str

class CorrectionData(BaseModel):
    correctIsHate: bool
    correctHateType: str
    correctIsOffensive: bool
    correctHateLevel: str
    correctHateSeverity: int
    inputText: str
