import torch 
from transformers import BertTokenizer, BertForSequenceClassification

# Define category names
CATEGORY_NAMES = {
    1: "Political Hate",
    2: "Nationalism",
    3: "Classism",
    4: "Body shaming",
    5: "Sexism",
    6: "Regionalism",
    7: "Racism",
    8: "Sectarianism"
}

# Load model and tokenizer once
model_path = './models/hate_category_dziribert/'
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)
model.eval()

# Set device (use GPU if available)
device = torch.device("cpu")
model.to(device)

# Load category mapping if exists
reverse_mapping = {}
try:
    with open(f"{model_path}/category_mapping.txt", 'r') as f:
        for line in f:
            original, mapped = line.strip().split(',')
            reverse_mapping[int(mapped)] = int(original)
except FileNotFoundError:
    reverse_mapping = None  # To check later in classify_text

def predict_category(text):
    """
    Classify a text using the trained hate speech model.
    Returns both the category ID and name.
    """
    # Tokenize the input text
    encoded_input = tokenizer.encode_plus(
        text,
        add_special_tokens=True,
        max_length=128,
        padding='max_length',
        truncation=True,
        return_attention_mask=True,
        return_tensors='pt'
    )
    
    # Move tensors to device
    input_ids = encoded_input['input_ids'].to(device)
    attention_mask = encoded_input['attention_mask'].to(device)
    
    # Get prediction
    with torch.no_grad():
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
    
    # Get predicted class
    predicted_class = torch.argmax(outputs.logits, dim=1).cpu().item()
    
    # Map back to original category ID
    if reverse_mapping:
        category_id = reverse_mapping.get(predicted_class, predicted_class)
    else:
        category_id = predicted_class
    
    # Get category name
    category_name = CATEGORY_NAMES.get(category_id, f"Unknown Category {category_id}")
    
    # Calculate confidence
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=1).cpu().numpy()[0]
    confidence = float(probabilities[predicted_class])
    
    return {
        'text': text,
        'label': category_id,
        'confidence': confidence,
        'interpretation': category_name
    }


print("Category detection model is running.......")
