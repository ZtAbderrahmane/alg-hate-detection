from hate_speech_detector import predict_hate_speech
from offensiveness_detector import predict_offensiveness
from category_detector import predict_category
from severity_detector import predict_severity
import math

def model(text: str):
    
    isHatePred = predict_hate_speech(text)
    isOffensivePred = predict_offensiveness(text)
    categoryPred = predict_category(text)
    severtiyPred = math.floor(predict_severity(text) * 100)
    get_hate_level = lambda s: 'low' if s <= 40 else 'mid' if s <= 70 else 'high'
    hateLevel = get_hate_level(severtiyPred)

    print('is hate : ' , isHatePred['label'])
    print('is offensive : ' , isOffensivePred['label'])
    print('category : ' , categoryPred['label'])
    print('serverity : ' , severtiyPred)

    return {
        "isHate": isHatePred['label'],
        "hateType": categoryPred['interpretation'],
        "isOffensive": isOffensivePred['label'],
        "hateLevel": hateLevel,
        "hateSeverity": int(severtiyPred),
        "inputText": text
    }
