// Get HTML elements
const addSubjectBtn = document.getElementById("addSubjectBtn");
const subjectModal = document.getElementById("subjectModal");

const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

// Open modal
addSubjectBtn.addEventListener("click", function () {
    subjectModal.hidden = false;
});

// Close modal using cross button
closeModal.addEventListener("click", function () {
    subjectModal.hidden = true;
});

// Close modal using cancel button
cancelModal.addEventListener("click", function () {
    subjectModal.hidden = true;
});

// Close modal by clicking outside the box
subjectModal.addEventListener("click", function (event) {
    if (event.target === subjectModal) {
        subjectModal.hidden = true;
    }
});

// Get the subject form elements
const subjectForm = document.getElementById("subjectForm");
const subjectsList = document.getElementById("subjectsList");

const subjectName = document.getElementById("subjectName");
const subjectHours = document.getElementById("subjectHours");

// Handle form submission
subjectForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = subjectName.value.trim();
    const target = Number(subjectHours.value);

    if (!name || !Number.isFinite(target) || target <= 0) {
        alert("Please enter valid subject details.");
        return;
    }

    // Create a new subject
    const subjectCard = document.createElement("div");

    subjectCard.classList.add("subject-card");

    subjectCard.dataset.target = target;
    subjectCard.dataset.completed = 0;

    subjectCard.innerHTML = `
        <div class="subject-info">
            <h3>${escapeHTML(name)}</h3>
            <span>0%</span>
        </div>

        <div class="progress-bar">
            <div class="progress" style="width: 0%"></div>
        </div>

        <p>0 / ${target} hours completed this week</p>
    `;

    subjectsList.appendChild(subjectCard);
    updateTotalStudyHours();

    subjectModal.hidden = true;
    subjectForm.reset();

});

// Safely display user-entered text
function escapeHTML(value) {
    return value.replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// Study Hours Tracker

const completedHoursDisplay = document.getElementById("completedHours");
const weeklyTargetDisplay = document.getElementById("weeklyTarget");
const studyProgress = document.getElementById("studyProgress");
const studyProgressText = document.getElementById("studyProgressText");

const hoursInput = document.getElementById("hoursInput");
const logHoursBtn = document.getElementById("logHoursBtn");

// Display weekly target
weeklyTargetDisplay.textContent = weeklyStudyTarget;

// Update dashboard
function updateStudyHours() {

    completedHoursDisplay.textContent = completedStudyHours;

    const percentage = Math.min(
        (completedStudyHours / weeklyStudyTarget) * 100,
        100
    );

    studyProgress.style.width = percentage + "%";

    studyProgressText.textContent =
        Math.round(percentage) + "% of weekly target completed";
}

// Log study hours
logHoursBtn.addEventListener("click", function () {

    const hours = Number(hoursInput.value);

    if (!Number.isFinite(hours) || hours <= 0 || hours > 24) {
        alert("Please enter a valid number of hours (maximum 24).");
        return;
    }

    completedStudyHours += hours;

    updateStudyHours();

    hoursInput.value = "";
});

function updateTotalStudyHours() {

    const subjectCards = document.querySelectorAll(
        "#subjectsList .subject-card"
    );

    let totalHours = 0;

    subjectCards.forEach(function (card) {
        totalHours += Number(card.dataset.completed) || 0;
    });

    document.getElementById("totalStudyHours").textContent =
        totalHours;
}

// Calculate total hours when the page loads
updateTotalStudyHours();