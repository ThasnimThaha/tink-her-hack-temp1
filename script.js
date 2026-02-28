let timetableData = {};

fetch("timetable.json")
    .then(response => response.json())
    .then(data => {
        timetableData = data;
        loadBranches();
    });

function loadBranches() {
    const branchSelect = document.getElementById("branch");
    for (let branch in timetableData) {
        branchSelect.innerHTML += `<option value="${branch}">${branch}</option>`;
    }
}

function loadSemesters() {
    const branch = document.getElementById("branch").value;
    const semesterSelect = document.getElementById("semester");
    semesterSelect.innerHTML = `<option value="">-- Select Semester --</option>`;

    if (branch && timetableData[branch]) {
        for (let sem in timetableData[branch]) {
            semesterSelect.innerHTML += `<option value="${sem}">${sem}</option>`;
        }
    }
}

function loadSubjects() {
    const branch = document.getElementById("branch").value;
    const semester = document.getElementById("semester").value;
    const subjectSelect = document.getElementById("subject");

    subjectSelect.innerHTML = `<option value="">-- Select Subject --</option>`;

    if (branch && semester) {
        const subjects = timetableData[branch][semester].subjects;
        for (let sub in subjects) {
            subjectSelect.innerHTML += `<option value="${sub}">${sub}</option>`;
        }
    }
}

function calculateAttendance() {

    const branch = document.getElementById("branch").value;
    const semester = document.getElementById("semester").value;
    const subject = document.getElementById("subject").value;
    const attendancePercent = parseFloat(document.getElementById("attendance").value);

    if (!branch || !semester || !subject || !attendancePercent) {
        alert("Bro fill everything properly 😭");
        return;
    }

    const semesterData = timetableData[branch][semester];
    const calendar = semesterData.calendar;
    const subjectDays = semesterData.subjects[subject];

    const startDate = new Date(calendar.startDate);
    const endDate = new Date(calendar.endDate);
    const today = new Date();

    if (today < startDate) {
        alert("Semester hasn’t started yet 😎");
        return;
    }

    const holidays = calendar.holidays.map(d => new Date(d).toDateString());

    let totalClasses = 0;
    let conductedClasses = 0;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {

        const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });

        if (holidays.includes(d.toDateString())) continue;

        if (subjectDays.includes(dayName)) {

            totalClasses++;

            if (d <= today) {
                conductedClasses++;
            }
        }
    }

    const remainingClasses = totalClasses - conductedClasses;
    const attended = (attendancePercent / 100) * conductedClasses;

    const resultDiv = document.getElementById("result");
    resultDiv.className = "";

    if (attendancePercent >= 75) {

        const maxBunk = Math.floor((attended / 0.75) - conductedClasses);

        resultDiv.classList.add("safe");
        resultDiv.innerHTML = `
        😎 CHILL ZONE ACTIVATED <br><br>
        📅 Today: ${today.toDateString()} <br>
        📘 Total Classes: ${totalClasses} <br>
        ✅ Conducted Till Today: ${conductedClasses} <br>
        ⏳ Remaining Classes: ${remainingClasses} <br><br>
        💤 You can bunk <b>${maxBunk}</b> classes safely <br>
        ${maxBunk > 5 ? "Go watch a movie 🍿" : "Bunk wisely 😏"}
        `;

    } else {

        const needed = Math.ceil(
            ((0.75 * conductedClasses - attended) / (1 - 0.75))
        );

        resultDiv.classList.add("danger");
        resultDiv.innerHTML = `
        🚨 DANGER ZONE <br><br>
        📅 Today: ${today.toDateString()} <br>
        📘 Total Classes: ${totalClasses} <br>
        ⏳ Remaining Classes: ${remainingClasses} <br><br>
        📚 Attend next <b>${needed}</b> classes continuously 😭<br>
        HOD is watching 👀
        `;
    }
}
/* ===== DARK MODE ===== */
function toggleTheme(){
    document.body.classList.toggle("dark")
}

/* ===== 3D CARD TILT ===== */
const card=document.querySelector(".card")

card.addEventListener("mousemove",(e)=>{
    const rect=card.getBoundingClientRect()
    const x=e.clientX-rect.left
    const y=e.clientY-rect.top

    const centerX=rect.width/2
    const centerY=rect.height/2

    const rotateX=(y-centerY)/15
    const rotateY=(centerX-x)/15

    card.style.transform=`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
})

card.addEventListener("mouseleave",()=>{
    card.style.transform="rotateX(0) rotateY(0)"
})