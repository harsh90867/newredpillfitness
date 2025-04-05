(function () {
    console.log("Script loaded successfully");

    // Display logged-in username
    document.addEventListener("DOMContentLoaded", function () {
        const username = localStorage.getItem("username");
        if (username) {
            document.getElementById("username").textContent = username;
            document.getElementById("user-display").textContent = username;
        }
    });   


 // ------------------ Goal Setting ------------------
    const workoutGoalInput = document.getElementById('workout-goal');
    const waterGoalInput = document.getElementById('water-goal');
    const calorieGoalInput = document.getElementById('calorie-goal');
    const saveGoalsButton = document.getElementById('save-goals');

    const workoutGoalDisplay = document.getElementById('workout-goal-display');
    const waterGoalDisplay = document.getElementById('water-goal-display');
    const calorieGoalDisplay = document.getElementById('calorie-goal-display');

    let workoutGoal = parseFloat(localStorage.getItem('workoutGoal')) || 60;
    let waterGoal = parseFloat(localStorage.getItem('waterGoal')) || 3;
    let calorieGoal = parseFloat(localStorage.getItem('calorieGoal')) || 2000;

    function updateGoalDisplay() {
        workoutGoalDisplay.textContent = workoutGoal;
        waterGoalDisplay.textContent = waterGoal;
        calorieGoalDisplay.textContent = calorieGoal;
    }

    updateGoalDisplay();

    if (saveGoalsButton) {
        saveGoalsButton.addEventListener('click', function() {
            workoutGoal = parseFloat(workoutGoalInput.value) || workoutGoal;
            waterGoal = parseFloat(waterGoalInput.value) || waterGoal;
            calorieGoal = parseFloat(calorieGoalInput.value) || calorieGoal;

            localStorage.setItem('workoutGoal', workoutGoal);
            localStorage.setItem('waterGoal', waterGoal);
            localStorage.setItem('calorieGoal', calorieGoal);

            updateGoalDisplay();
            alert('Goals saved successfully!');
        });
    }

    // ------------------ Daily Input and Progress ------------------
    const workoutInput = document.getElementById('workout-input');
    const waterInput = document.getElementById('water-input');
    const calorieInput = document.getElementById('calorie-input');
    const inputButtons = document.querySelectorAll('.input-btn'); //Added selector

    // Progress Bar Elements (Added)
    const workoutProgress = document.getElementById('workout-progress');
    const waterProgress = document.getElementById('water-progress');
    const calorieProgress = document.getElementById('calorie-progress');

    const workoutProgressLabel = document.getElementById('workout-progress-label');
    const waterProgressLabel = document.getElementById('water-progress-label');
    const calorieProgressLabel = document.getElementById('calorie-progress-label');

    // Load Daily Progress from localStorage  ***USE PROGRESS KEYS and parseFloat*** (Added)
    const workoutProgressKey = 'dailyWorkoutProgress'; // Define keys
    const waterProgressKey = 'dailyWaterProgress';
    const calorieProgressKey = 'dailyCalorieProgress';

    let dailyWorkoutProgress = parseFloat(localStorage.getItem(workoutProgressKey)) || 0;
    let dailyWaterProgress = parseFloat(localStorage.getItem(waterProgressKey)) || 0;
    let dailyCalorieProgress = parseFloat(localStorage.getItem(calorieProgressKey)) || 0;

    // Update Progress Bars and Labels with loaded values (Added)
    workoutProgress.style.width = `${dailyWorkoutProgress}%`;
    workoutProgressLabel.textContent = `${dailyWorkoutProgress.toFixed(1)}%`;

    waterProgress.style.width = `${dailyWaterProgress}%`;
    waterProgressLabel.textContent = `${dailyWaterProgress.toFixed(1)}%`;

    calorieProgress.style.width = `${dailyCalorieProgress}%`;
    calorieProgressLabel.textContent = `${dailyCalorieProgress.toFixed(1)}%`;


    // ------------------ Chart Integration (Example) ------------------
    // You'll need to customize this for each chart and data type
    let activeMinutesChart;
    let waterIntakeChart;
    let dietChart;
    let overallProgressChart;
    let chartLoaded = false;

    async function createChart(canvasId, type, data, options) {
        return new Promise((resolve, reject) => {
            const ctx = document.getElementById(canvasId).getContext('2d');
            try {
                const chart = new Chart(ctx, {
                    type: type,
                    data: data,
                    options: options
                });
                resolve({ chart });
            } catch (error) {
                console.error(`Error creating chart ${canvasId}:`, error);
                reject({ error });
            }
        });
    }

    async function loadOverallProgressChart() {
        const progressData = {
            labels: ['Workout', 'Water', 'Diet'],
            datasets: [{
                label: 'Progress',
                data: [0, 0, 0], // Initialize
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        };

        const progressOptions = {
            cutout: '70%'
        };

        try {
            const { chart } = await createChart('progressChart', 'doughnut', progressData, progressOptions);
            overallProgressChart = chart;
            chartLoaded = true;
            console.log("Chart Loaded", chartLoaded);
        } catch (error) {
            console.log(error);
        }
    }

    function updateChartData(type, data) {
        if (!chartLoaded) {
            console.log("Chart Not Loaded", chartLoaded);
            return;
        }

        if (type === 'workout') {
            overallProgressChart.data.datasets[0].data[0] = data;
        }

        if (type === 'water') {
            overallProgressChart.data.datasets[0].data[1] = data;
        }

        if (type === 'calorie') {
            overallProgressChart.data.datasets[0].data[2] = data;
        }

        overallProgressChart.update();
    }


    // Function to load simulated data (for testing)
    function loadSimulatedData(type) {
        return new Promise(resolve => {
            setTimeout(() => {
                let data;
                const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

                switch (type) {
                    case 'workout':
                        data = labels.map(() => Math.floor(Math.random() * 60)); // Up to 60 minutes
                        break;
                    case 'water':
                        data = labels.map(() => (Math.random() * 4).toFixed(1)); // Up to 4 liters
                        break;
                    case 'calorie':
                        data = labels.map(() => Math.floor(1500 + Math.random() * 1000)); // 1500-2500 calories
                        break;
                    default:
                        data = [];
                }

                resolve({
                    labels,
                    data
                });
            }, 500); // Simulate a 0.5-second loading time
        });
    }

    //Load Chart Function
    async function loadChart(canvasId, chartType, dataLoader) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas element with id "${canvasId}" not found.`);
            return;
        }
        try {
            const chartData = await dataLoader();
            const chart = new Chart(canvas, {
                type: chartType,
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: canvasId,
                        data: chartData.data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            return chart;
        } catch (error) {
            console.error(`Error creating chart "${canvasId}":`, error);
        }
    }
    //Load all charts

    async function loadAllChart() {
        activeMinutesChart = await loadChart('activeMinutesChart', 'line', () => loadSimulatedData('workout'))
        waterIntakeChart = await loadChart('waterIntakeChart', 'bar', () => loadSimulatedData('water'))
        dietChart = await loadChart('dietChart', 'radar', () => loadSimulatedData('calorie'))
    }

    // ---------------------------------- Update Chart Here ------------------------------

    function updateProgress(inputType) {
        let inputValue;
        let goalValue;
        let progressElement;
        let progressLabelElement;
        let localStorageProgressKey;

        switch (inputType) {
            case 'workout':
                inputValue = parseFloat(workoutInput.value);
                goalValue = workoutGoal;
                progressElement = workoutProgress;
                progressLabelElement = workoutProgressLabel;
                localStorageProgressKey = workoutProgressKey;
                break;
            case 'water':
                inputValue = parseFloat(waterInput.value);
                goalValue = waterGoal;
                progressElement = waterProgress;
                progressLabelElement = waterProgressLabel;
                localStorageProgressKey = waterProgressKey;
                break;
            case 'calorie':
                inputValue = parseFloat(calorieInput.value);
                goalValue = calorieGoal;
                progressElement = calorieProgress;
                progressLabelElement = calorieProgressLabel;
                localStorageProgressKey = calorieProgressKey;
                break;
            default:
                return;
        }

        const progress = Math.min((inputValue / goalValue) * 100, 100); // Cap at 100%

        progressElement.style.width = `${progress}%`;
        progressLabelElement.textContent = `${progress.toFixed(1)}%`; // One decimal place

        localStorage.setItem(localStorageProgressKey, progress); // Save the *progress* ***TO THE RIGHT KEY***

        //Update Chart (You'll need to adapt this)
        if (chartLoaded) { // Ensure chartLoaded is true before updating chart
            updateChartData(inputType, progress);
        }

        // Save progress to history *after* updating localStorage
        saveProgressToHistory();
        updateEachChart(inputType)
    }

    //Update each chart
    function updateEachChart(inputType) {
        switch (inputType) {
            case 'workout':
                updateChart(activeMinutesChart)
                break;
            case 'water':
                updateChart(waterIntakeChart)
                break;
            case 'calorie':
                updateChart(dietChart)
                break;
            default:
                break;
        }
    }
    //Function to update each charts
    function updateChart(chart) {
        loadSimulatedData().then((newData) => {
            chart.data.datasets[0].data = newData;
            chart.update();
        })
    }

    loadAllChart()


    // ------------------ Progress Tracking ------------------
    //Replaced progress tracker with one from script 1
    inputButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.input;
            updateProgress(type);
        });
    });

    // ------------------ Workout History ------------------ (Replaced with script 1 code)
    function getFormattedDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function saveProgressToHistory() {
        const date = getFormattedDate();
        const workoutProgress = parseFloat(localStorage.getItem(workoutProgressKey)) || 0;
        const waterProgress = parseFloat(localStorage.getItem(waterProgressKey)) || 0;
        const calorieProgress = parseFloat(localStorage.getItem(calorieProgressKey)) || 0;

        const progressData = {
            workout: workoutProgress,
            water: waterProgress,
            calorie: calorieProgress
        };

        localStorage.setItem(`progressHistory-${date}`, JSON.stringify(progressData));
        displayProgressHistory(); // Update the display after saving
    }

    function displayProgressHistory() {
        const historyContainer = document.getElementById('progress-history');
        historyContainer.innerHTML = ''; // Clear existing content

        // Create Table
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';

        //Create Table Header
        const headerRow = document.createElement('tr');
        headerRow.style.backgroundColor = '#f2f2f2';
        const headers = ['Date', 'Workout (%)', 'Water (%)', 'Calories (%)'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.textAlign = 'left';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Load and display history data
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('progressHistory-')) {
                const date = key.replace('progressHistory-', '');
                const progressData = JSON.parse(localStorage.getItem(key));

                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid #ddd';

                const dateCell = document.createElement('td');
                dateCell.textContent = date;
                dateCell.style.border = '1px solid #ddd';
                dateCell.style.padding = '8px';
                row.appendChild(dateCell);

                const workoutCell = document.createElement('td');
                workoutCell.textContent = progressData.workout.toFixed(1);
                workoutCell.style.border = '1px solid #ddd';
                workoutCell.style.padding = '8px';
                row.appendChild(workoutCell);

                const waterCell = document.createElement('td');
                waterCell.textContent = progressData.water.toFixed(1);
                waterCell.style.border = '1px solid #ddd';
                waterCell.style.padding = '8px';
                row.appendChild(waterCell);

                const calorieCell = document.createElement('td');
                calorieCell.textContent = progressData.calorie.toFixed(1);
                calorieCell.style.border = '1px solid #ddd';
                calorieCell.style.padding = '8px';
                row.appendChild(calorieCell);

                table.appendChild(row);
            }
        }
        historyContainer.appendChild(table);
    }

    // Load the chart AFTER defining all chart-related functions

    loadOverallProgressChart().then(() => {
        console.log("Chart loaded successfully!");

        displayProgressHistory(); // Initial display of history
    });

    // ------------------ View Progress Button ------------------  (Keeping script 2 code)
    const viewProgressButton = document.getElementById('view-progress-btn');

    if (viewProgressButton) {
        viewProgressButton.addEventListener('click', function() {
            displayProgressHistory();
        });
    }

    window.onload = function() {
        displayProgressHistory();
        loadAllChart(); // Load all charts when the window loads
    };
    // Function to open the workout/diet plan generator page
    function openGeneratorPage() {
        window.location.href = 'generator.html'; // Replace with the actual path
    }

    // Event listener for the "Generate Workout/Diet Plan" button
    const openGeneratorButton = document.querySelector('.open-generator-btn');
    if (openGeneratorButton) {
        openGeneratorButton.addEventListener('click', openGeneratorPage);
    }
})();

document.addEventListener("DOMContentLoaded", function () {
    const welcomePopup = document.getElementById("welcome-popup");
    const closePopupButton = document.getElementById("close-popup");
    const letsGoButton = document.getElementById("lets-go-button");
    const popupContent = welcomePopup.querySelector('.popup-content');

    let popupDisplayCount = 0;
    const maxDisplayCount = 3;
    const popupDelay = 3000;

     // Make closePopup a named function for better readability
    function closeThePopup() {
        welcomePopup.style.display = "none";
    }

    function showPopupWithDelay() {
        if (popupDisplayCount < maxDisplayCount) {
             // Ensure popup is visible before adding loading class
            welcomePopup.style.display = "flex";
            popupContent.classList.add("loading");
            setTimeout(() => {
                popupContent.classList.remove("loading");
                welcomePopup.classList.add("show");
                popupDisplayCount++;
            }, popupDelay);
        }
    }

   // Attach event listeners *after* the functions are defined
    closePopupButton.addEventListener("click", closeThePopup);
    letsGoButton.addEventListener("click", closeThePopup);

    //Initial Show
    showPopupWithDelay();

});