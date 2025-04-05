import sys
import numpy as np
from PIL import Image
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import os
os.environ["LOKY_MAX_CPU_COUNT"] = "10"  # Set this to match your physical core count

# Ensure the script is called with an image path argument
if len(sys.argv) < 2:
    print("Error: No image path provided.")
    sys.exit(1)

image_path = sys.argv[1]

# Function to preprocess a single image
def preprocess_image(image_path):
    try:
        image = Image.open(image_path).convert('L')  # Convert to grayscale
        image = image.resize((64, 64))               # Resize to 64x64
        return np.array(image).flatten()             # Flatten image data
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        sys.exit(1)

# Function to load and preprocess training data
def load_training_data():
    folder_paths = ['data/cardio_low_carb', 'data/strength_high_protein']
    images, labels = [], []
    for folder_path in folder_paths:
        for filename in os.listdir(folder_path):
            filepath = os.path.join(folder_path, filename)
            if os.path.isfile(filepath):
                images.append(preprocess_image(filepath))
                labels.append(0 if 'cardio_low_carb' in folder_path else 1)
    return np.array(images), np.array(labels)

# Load and preprocess training data
X, y = load_training_data()
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize the data
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train the KNN model
model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)

# Preprocess the input image and predict
image_data = preprocess_image(image_path)
image_data = scaler.transform([image_data])
prediction = model.predict(image_data)

# Output the prediction (0 or 1)
print(prediction[0])



