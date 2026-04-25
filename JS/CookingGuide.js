document.addEventListener("DOMContentLoaded", function() {
    const recipeName = document.getElementById("recipeName");
    const recipeDesc = document.getElementById("recipeDesc");
    const timeTag = document.getElementById("timeTag");
    const calTag = document.getElementById("calTag");
    const stepsList = document.getElementById("stepsList");
    const returnButton = document.getElementById("returnButton");

    let recipe = null;

    try {
        recipe = JSON.parse(localStorage.getItem("currentRecipe") || "null");
    } catch (error) {
        recipe = null;
    }

    const returnHref = localStorage.getItem("cookingGuideReturnHref") || "MyFavorites.html";
    const returnLabel = localStorage.getItem("cookingGuideReturnLabel") || "חזרה למועדפים";

    if (returnButton) {
        returnButton.href = returnHref;
        returnButton.textContent = returnLabel;
    }

    function setMissingRecipeState() {
        recipeName.textContent = "המתכון לא נמצא - נא לחזור למועדפים";
        recipeDesc.textContent = "לא נשמר מתכון פעיל ב-localStorage.";
        timeTag.textContent = "--";
        calTag.textContent = "--";
        stepsList.innerHTML = `
            <li>
                <div class="step-content">
                    <span class="step-label">אין נתונים</span>
                    <p>פתח/י מתכון מחדש מתוך דף המועדפים כדי לטעון את מדריך הבישול.</p>
                </div>
            </li>
        `;
    }

    if (!recipe) {
        setMissingRecipeState();
        return;
    }

    recipeName.textContent = recipe.name || "מתכון";
    recipeDesc.textContent = recipe.desc || "";
    timeTag.textContent = recipe.time || "--";
    calTag.textContent = (recipe.cal || "0") + " קק\"ל";

    stepsList.innerHTML = "";
    if (Array.isArray(recipe.steps) && recipe.steps.length > 0) {
        recipe.steps.forEach((step, i) => {
            renderStep(step, i);
        });
    } else {
        stepsList.innerHTML = `
            <li>
                <div class="step-content">
                    <span class="step-label">שלבים לא זמינים</span>
                    <p>למתכון הזה עדיין לא הוגדרו שלבי הכנה.</p>
                </div>
            </li>
        `;
    }

    function renderStep(stepText, stepIndex) {
        const stepItem = document.createElement("li");
        const stepContent = document.createElement("div");
        const stepLabel = document.createElement("span");
        const stepTextNode = document.createElement("p");
        const timerDetails = extractStepDuration(stepText);

        stepItem.className = "cooking-step-item";
        stepContent.className = "step-content";
        stepLabel.className = "step-label";
        stepLabel.textContent = `שלב ${stepIndex + 1}`;
        stepTextNode.textContent = stepText;

        stepContent.appendChild(stepLabel);
        stepContent.appendChild(stepTextNode);
        stepItem.appendChild(stepContent);

        if (timerDetails) {
            stepItem.appendChild(createStepTimer(timerDetails, stepIndex));
        }

        stepsList.appendChild(stepItem);
    }

    function createStepTimer(timerDetails, stepIndex) {
        const timerBox = document.createElement("div");
        const timerHint = document.createElement("div");
        const timerDisplay = document.createElement("div");
        const controls = document.createElement("div");
        const startButton = document.createElement("button");
        const resetButton = document.createElement("button");

        let totalSeconds = timerDetails.totalSeconds;
        let intervalId = null;

        timerBox.className = "step-timer";
        timerHint.className = "step-timer-hint";
        timerDisplay.className = "step-timer-display";
        controls.className = "step-timer-controls";

        startButton.className = "btn btn-primary";
        startButton.type = "button";
        startButton.textContent = "התחל טיימר";

        resetButton.className = "btn btn-outline";
        resetButton.type = "button";
        resetButton.textContent = "איפוס";

        timerHint.textContent = `טיימר לשלב זה: ${timerDetails.label}`;

        function updateDisplay() {
            timerDisplay.textContent = formatTime(totalSeconds);
        }

        startButton.addEventListener("click", function() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                startButton.textContent = "המשך";
                startButton.style.background = "#f39c12";
                return;
            }

            intervalId = setInterval(function() {
                if (totalSeconds > 0) {
                    totalSeconds--;
                    updateDisplay();
                    return;
                }

                clearInterval(intervalId);
                intervalId = null;
                startButton.textContent = "התחל טיימר";
                startButton.style.background = "";
                alert(`הטיימר של שלב ${stepIndex + 1} הסתיים.`);
            }, 1000);

            startButton.textContent = "השהה";
            startButton.style.background = "#e74c3c";
        });

        resetButton.addEventListener("click", function() {
            clearInterval(intervalId);
            intervalId = null;
            totalSeconds = timerDetails.totalSeconds;
            updateDisplay();
            startButton.textContent = "התחל טיימר";
            startButton.style.background = "";
        });

        updateDisplay();

        controls.appendChild(startButton);
        controls.appendChild(resetButton);
        timerBox.appendChild(timerHint);
        timerBox.appendChild(timerDisplay);
        timerBox.appendChild(controls);

        return timerBox;
    }

    function extractStepDuration(stepText) {
        const normalizedText = stepText.replace(/-/g, " ");
        const minuteMatch = normalizedText.match(/(\d+)\s*(דקות|דקה|דק['"]?|minutes?|mins?)/i);
        const secondMatch = normalizedText.match(/(\d+)\s*(שניות|שניה|שנ'?|seconds?|secs?)/i);

        if (minuteMatch) {
            const minutes = parseInt(minuteMatch[1], 10);
            if (!Number.isNaN(minutes) && minutes > 0) {
                return {
                    totalSeconds: minutes * 60,
                    label: `${minutes} דקות`
                };
            }
        }

        if (secondMatch) {
            const seconds = parseInt(secondMatch[1], 10);
            if (!Number.isNaN(seconds) && seconds > 0) {
                return {
                    totalSeconds: seconds,
                    label: `${seconds} שניות`
                };
            }
        }

        return null;
    }

    function formatTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
    }
});
