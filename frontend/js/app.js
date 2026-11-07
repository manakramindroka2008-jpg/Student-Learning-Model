
/* =========================================
   1. ADD SUBJECT MODAL
========================================= */

// Get HTML elements
const addSubjectBtn = document.getElementById("addSubjectBtn");
const subjectModal = document.getElementById("subjectModal");

const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

// Open Add Subject modal
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

// Close modal by clicking outside
subjectModal.addEventListener("click", function (event) {
    if (event.target === subjectModal) {
        subjectModal.hidden = true;
    }
});


/* =========================================
   2. ADD NEW SUBJECT
========================================= */

// Get subject form elements
const subjectForm = document.getElementById("subjectForm");
const subjectsList = document.getElementById("subjectsList");

const subjectName = document.getElementById("subjectName");
const subjectHours = document.getElementById("subjectHours");

// Handle subject form submission
subjectForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = subjectName.value.trim();
    const target = Number(subjectHours.value);

    if (!name || !Number.isFinite(target) || target <= 0) {
        alert("Please enter valid subject details.");
        return;
    }

    // Create a new subject card
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

    // Add subject to dashboard
    subjectsList.appendChild(subjectCard);

    // Update total study hours
    updateTotalStudyHours();

    // Close modal and reset form
    subjectModal.hidden = true;
    subjectForm.reset();

});


/* =========================================
   3. HTML INPUT SECURITY
========================================= */

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


/* =========================================
   4. TOTAL STUDY HOURS
========================================= */

function updateTotalStudyHours() {

    const subjectCards = document.querySelectorAll(
        "#subjectsList .subject-card"
    );

    let totalHours = 0;

    subjectCards.forEach(function (card) {

        totalHours += Number(card.dataset.completed) || 0;

    });

    document.getElementById("totalStudyHours").textContent =
        Number(totalHours.toFixed(2));

}

// Calculate total hours when page loads
updateTotalStudyHours();


/* =========================================
   5. SUBJECT-WISE STUDY HOURS TRACKER
========================================= */

// Get study modal elements
const studyModal = document.getElementById("studyModal");

const logStudyBtn = document.getElementById("logStudyBtn");

const closeStudyModal = document.getElementById("closeStudyModal");
const cancelStudyModal = document.getElementById("cancelStudyModal");

const studyForm = document.getElementById("studyForm");

const studySubject = document.getElementById("studySubject");
const studyHoursInput = document.getElementById("studyHoursInput");


// Load subjects into dropdown
function loadSubjectOptions() {

    studySubject.innerHTML = `
        <option value="">Choose a subject</option>
    `;

    const subjectCards = document.querySelectorAll(
        "#subjectsList .subject-card"
    );

    subjectCards.forEach(function (card, index) {

        const name = card.querySelector("h3").textContent;

        const option = document.createElement("option");

        option.value = index;
        option.textContent = name;

        studySubject.appendChild(option);

    });

}


// Open Log Study Hours modal
logStudyBtn.addEventListener("click", function () {

    loadSubjectOptions();

    studyModal.hidden = false;

});


// Close study modal
function closeStudyPopup() {

    studyModal.hidden = true;

    studyForm.reset();

}

closeStudyModal.addEventListener("click", closeStudyPopup);

cancelStudyModal.addEventListener("click", closeStudyPopup);


// Close modal by clicking outside
studyModal.addEventListener("click", function (event) {

    if (event.target === studyModal) {
        closeStudyPopup();
    }

});


// Handle study hours submission
studyForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const selectedIndex = Number(studySubject.value);

    const hours = Number(studyHoursInput.value);

    const subjectCards = document.querySelectorAll(
        "#subjectsList .subject-card"
    );

    // Validate input
    if (
        studySubject.value === "" ||
        !Number.isInteger(selectedIndex) ||
        !subjectCards[selectedIndex] ||
        !Number.isFinite(hours) ||
        hours <= 0 ||
        hours > 24
    ) {

        alert("Please select a subject and enter valid hours (maximum 24).");

        return;

    }

    // Get selected subject
    const selectedCard = subjectCards[selectedIndex];

    let completed = Number(selectedCard.dataset.completed) || 0;

    const target = Number(selectedCard.dataset.target);

    if (!Number.isFinite(target) || target <= 0) {

        alert("This subject has an invalid weekly target.");

        return;

    }

    // Add newly studied hours
    completed += hours;

    selectedCard.dataset.completed = completed;

    // Calculate progress percentage
    const percentage = Math.min(
        (completed / target) * 100,
        100
    );

    // Update percentage
    selectedCard.querySelector(".subject-info span").textContent =
        percentage.toFixed(1).replace(/\.0$/, "") + "%";

    // Update progress bar
    selectedCard.querySelector(".progress").style.width =
        percentage + "%";

    // Update completed hours text
    selectedCard.querySelector("p").textContent =
        `${Number(completed.toFixed(2))} / ${target} hours completed this week`;

    // Update total study hours
    updateTotalStudyHours();

    // Close popup
    closeStudyPopup();

});
