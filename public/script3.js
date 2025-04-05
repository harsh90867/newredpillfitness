// script.js
document.getElementById('generate-button').addEventListener('click', generatePlan);

function generatePlan() {
    const goal = document.getElementById('goal').value;
    const diet = document.getElementById('diet').value;

    let workoutPlan = {};

    if (goal === "gainmuscle") {
        workoutPlan = {
            "Day 1": "Chest and Back: Push-ups, Pull-ups, Dumbbell Press, Rows",
            "Day 2": "Legs: Squats, Lunges, Calf Raises, Glute Bridges",
            "Day 3": "Shoulders and Arms: Shoulder Press, Lateral Raises, Bicep Curls, Tricep Dips",
            "Day 4": "Core: Planks, Russian Twists, Leg Raises, Bicycle Crunches",
            "Day 5": "Full Body: Burpees, Mountain Climbers, Jump Squats, Push-ups",
            "Day 6": "Cardio: Jump Rope, High Knees, Butt Kicks, Sprint in Place",
            "Day 7": "Rest or Light Yoga/Stretching"
        };
    } else if (goal === "losefat") {
        workoutPlan = {
            "Day 1": "Cardio: Running on Treadmill, Cycling",
            "Day 2": "Cardio: HIIT Workout, Jumping Jacks, Burpees",
            "Day 3": "Cardio: Swimming, Rowing",
            "Day 4": "Cardio: Dancing, Zumba",
            "Day 5": "Cardio: Brisk Walking, Hiking",
            "Day 6": "Cardio: Jump Rope, High Knees, Butt Kicks, Sprint in Place",
            "Day 7": "Rest or Light Yoga/Stretching"
        };
    }
     else {
        alert("Invalid goal selected. Please choose 'Gain Muscle' or 'Lose Fat'.");
        return;
    }

    let dietPlan = {};

    if (goal === "gainmuscle") {
        if (diet === "vegetarian") {
            dietPlan = {
                "Breakfast": "Oats with milk, almonds, and banana",
                "Snack": "Protein shake with peanut butter",
                "Lunch": "Quinoa, lentils, and mixed vegetables",
                "Snack": "Greek yogurt with honey and walnuts",
                "Dinner": "Tofu stir-fry with brown rice",
                "Before Bed": "Casein protein or cottage cheese"
            };
        } else {
            dietPlan = {
                "Breakfast": "Scrambled eggs with whole-grain toast and avocado",
                "Snack": "Protein shake with banana",
                "Lunch": "Grilled chicken breast, sweet potato, and broccoli",
                "Snack": "Hard-boiled eggs and mixed nuts",
                "Dinner": "Salmon, quinoa, and asparagus",
                "Before Bed": "Casein protein or Greek yogurt"
            };
        }
    } else if (goal === "losefat") {
        if (diet === "vegetarian") {
            dietPlan = {
                "Breakfast": "Vegetable smoothie with spinach, cucumber, and apple",
                "Snack": "Handful of almonds",
                "Lunch": "Chickpea salad with mixed greens and olive oil dressing",
                "Snack": "Carrot sticks with hummus",
                "Dinner": "Grilled tofu with steamed vegetables",
                "Before Bed": "Herbal tea or a small piece of dark chocolate"
            };
        } else {
            dietPlan = {
                "Breakfast": "Boiled eggs with avocado and a slice of whole-grain bread",
                "Snack": "Greek yogurt with berries",
                "Lunch": "Grilled chicken salad with olive oil dressing",
                "Snack": "Celery sticks with peanut butter",
                "Dinner": "Baked fish with steamed broccoli and quinoa",
                "Before Bed": "Herbal tea or a small piece of dark chocolate"
            };
        }
    } else {
        alert("Invalid goal selected. Please choose 'Gain Muscle' or 'Lose Fat'.");
        return;
    }

    // Display the plan
    displayPlan(workoutPlan, dietPlan);
}

function displayPlan(workoutPlan, dietPlan) {
    const workoutList = document.getElementById('workout-list');
    const dietList = document.getElementById('diet-list');

    // Clear previous plan
    workoutList.innerHTML = '';
    dietList.innerHTML = '';

    // Populate Workout Plan
    for (const day in workoutPlan) {
        const listItem = document.createElement('li');
        listItem.textContent = `${day}: ${workoutPlan[day]}`;
        workoutList.appendChild(listItem);
    }

    // Populate Diet Plan
    for (const meal in dietPlan) {
        const listItem = document.createElement('li');
        listItem.textContent = `${meal}: ${dietPlan[meal]}`;
        dietList.appendChild(listItem);
    }

    // Show the plan section
    document.getElementById('plan-section').style.display = 'block';
}