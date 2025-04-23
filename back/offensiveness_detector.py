from transformers import BertTokenizer, BertForSequenceClassification
import torch
import os

# Set the path to your model directory
model_path = './models/offensiveness_model/'  # Use raw string or forward slashes

# Verify all required files exist
required_files = [  
    'config.json',
    'model.safetensors',  # or 'pytorch_model.bin' if you have that instead
    'vocab.txt',
    'tokenizer_config.json',
    'special_tokens_map.json'
]

for file in required_files:
    if not os.path.exists(os.path.join(model_path, file)):
        raise FileNotFoundError(f"Missing required file: {file}")

# Load tokenizer and model
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)

# Set device (GPU if available)
device = torch.device('cpu')
model = model.to(device)

def predict_offensiveness(text):
    """Predict whether text contains hate speech"""
    # Tokenize input text
    inputs = tokenizer(
        text, 
        return_tensors="pt", 
        truncation=True, 
        max_length=128
    ).to(device)
    
    # Get model predictions
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Process outputs
    probs = torch.softmax(outputs.logits, dim=1)
    label = torch.argmax(probs).item()
    confidence = probs[0][label].item()
    
    return {
        'text': text,
        'label': label,
        'confidence': confidence,
        'interpretation': 'offensive language' if label == 1 else 'Not offensive language'
    }

print("Offensiveness detection model is running.......")