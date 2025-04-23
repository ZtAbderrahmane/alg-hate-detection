from transformers import BertTokenizer, BertForSequenceClassification
import torch
import os

# Set the path to your model directory
model_path = './models/hate_severity_dziribert/'  # Adjust as needed

# Verify all required files exist
required_files = [
    'config.json',
    'model.safetensors',  # or 'pytorch_model.bin' if applicable
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
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)

def predict_severity(text):
    """Predict hate severity score from 0.0 to 1.0 (regression)"""
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=128,
        padding=True
    ).to(device)

    # Predict severity
    with torch.no_grad():
        outputs = model(**inputs)

    # Get regression output (no softmax)
    severity_score = outputs.logits.squeeze().item()
    
    return severity_score

print("Severity detection model is running.......")