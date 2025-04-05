document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('manual-form');
    const resultContainer = document.getElementById('result');
    const resultsContainer = document.querySelector('.results-container');

    // Image upload elements
    const imgArea = document.querySelector('.img-area');
    const fileInput = document.getElementById('default-btn');
    const customBtn = document.getElementById('custom-btn');
    const submitBtn = document.getElementById('submitBtn');
    let image; //Store selected image file

    // Get the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    let imageResult = urlParams.get('imageResult');
    let gender = urlParams.get('gender');

     //Display initial url query params
    if (imageResult) {
        resultContainer.textContent = `Image Prediction: ${imageResult}`;
    }
    if (gender) {
         if(imageResult){
           resultContainer.textContent = `Image Prediction: ${imageResult}, Gender: ${gender}`;
         } else {
             resultContainer.textContent = `Gender: ${gender}`;
         }
    }

    const modal = document.getElementById('myModal');
    const overlay = document.getElementById('overlay');
    const modalButton = document.getElementById('modalButton');
    const closeButton = document.querySelector('.modal .close-button');

    // Manual form submission handler
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const heightInput = document.getElementById('height').value;
        const weightInput = document.getElementById('weight').value;

        const heightParts = heightInput.split('.');
        const feet = parseInt(heightParts[0] || 0);
        const inches = parseInt(heightParts[1] || 0);
        const weight = parseFloat(weightInput);


        if (isNaN(feet) || isNaN(inches) || isNaN(weight) || feet < 0 || inches < 0 || weight <= 0) {
            resultContainer.textContent = 'Please enter valid decimal values for height and weight. Height should be in format of feet.inches (e.g., 5.11).';
            return;
        }

        const totalInches = (feet * 12) + inches;
        const heightMeters = totalInches * 0.0254; // Convert inches to meters
        const bmi = weight / (heightMeters * heightMeters);
        const roundedBmi = bmi.toFixed(2);

        let recommendation = '';
        if (bmi < 18.5) {
            recommendation = 'Your BMI is ' + roundedBmi + '. You are considered underweight. Recommended diet: Strength training and high-carb diet.';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            recommendation = 'Your BMI is ' + roundedBmi + '. You are considered a healthy weight. Recommended Diet: Balanced diet.';
        } else if (bmi >= 25 && bmi <= 29.9) {
            recommendation = 'Your BMI is ' + roundedBmi + '. You are considered overweight. Recommended diet: Cardio and low-carb diet.';
        } else {
            recommendation = 'Your BMI is ' + roundedBmi + '. You are considered obese. Recommended diet: Cardio and low-carb diet, consult a doctor.';
        }
         if(imageResult && gender){
              resultContainer.textContent = `Image Prediction: ${imageResult}, ${recommendation} Gender: ${gender}`;
         } else if(imageResult) {
              resultContainer.textContent = `Image Prediction: ${imageResult}, ${recommendation}`;
         } else if(gender) {
              resultContainer.textContent = `${recommendation}, Gender: ${gender}`;
         }  else {
             resultContainer.textContent = `${recommendation}`;
         }
          // Show the modal after BMI calculation
         setTimeout(() => {
             modal.style.display = 'block';
             overlay.style.display = 'block';
         }, 1000);
    });

    // Image upload functionality
    customBtn.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function (e) {
        image = e.target.files[0];
        if (image) {
            imgArea.dataset.img = image.name;
            imgArea.innerHTML = '';
            const reader = new FileReader();
            reader.onload = () => {
                const img = document.createElement('img');
                img.src = reader.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                imgArea.appendChild(img);
                imgArea.classList.remove('icon');
            }
            reader.readAsDataURL(image)
        } else {
            imgArea.innerHTML = '<i class=\'bx bxs-cloud-upload icon\'></i><h3>Upload Image</h3>';
            imgArea.classList.add('icon');
            imgArea.removeAttribute('data-img');
        }
    });

    submitBtn.addEventListener('click', async function () {
        if (!fileInput || !fileInput.files.length) {
            resultContainer.textContent = 'Please Select Image First';
            return;
        }
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);

        try {
            const response = await fetch(`/upload`, { //Remove query param here
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error("Upload Failed");
            }
            const result = await response.json();
            imageResult = result.prediction // Update imageResult variable
           if(gender){
                resultContainer.textContent = `Image Prediction: ${imageResult}, Gender: ${gender}`;
            } else {
                resultContainer.textContent = `Image Prediction: ${imageResult}`;
            }
              // Show modal after 1 sec
              setTimeout(() => {
                  modal.style.display = 'block';
                  overlay.style.display = 'block';
              }, 1000);
        } catch (error) {
            console.error('Error:', error);
            resultContainer.textContent = "Error occurred during upload"
        }
    });

     modalButton.addEventListener('click', () => {
        // Redirect to generator.html
        window.location.href = 'generator.html';
        closeModal();
    });

    closeButton.addEventListener('click', closeModal);

    function closeModal() {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }

});