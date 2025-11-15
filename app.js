// ===============================
// Firebase Configuration
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyA8l_MaspV9DK97xqt4wqdzRo8Oz1s6GTg",
  authDomain: "campus-connect-b714f.firebaseapp.com",
  projectId: "campus-connect-b714f",
  storageBucket: "campus-connect-b714f.firebasestorage.app",
  messagingSenderId: "100751633357",
  appId: "1:100751633357:web:34897f00be1bfb1f4bf284",
  measurementId: "G-NWPM6F53PP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===============================
// Outline Functions
// ===============================
function updateOutline(event) {
  event.preventDefault();

  const lab = document.getElementById('labName').value;
  const block = document.getElementById('blockNo').value;
  const floor = document.getElementById('floorNo').value;
  const room = document.getElementById('roomNo').value;

  db.collection("collegeOutlines").add({
    labName: lab,
    blockNo: block,
    floorNo: floor,
    roomNo: room,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    alert("Outline added successfully ✅");
    document.getElementById('labName').value = "";
    document.getElementById('blockNo').value = "";
    document.getElementById('floorNo').value = "";
    document.getElementById('roomNo').value = "";
    loadOutlines();
    showSection('see');
  })
  .catch((error) => {
    console.error("Error adding outline: ", error);
    alert("Error adding outline!");
  });
}

function loadOutlines() {
  const outlineList = document.getElementById("outlineList");
  if (!outlineList) return;
  outlineList.innerHTML = "";

  db.collection("collegeOutlines")
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        outlineList.innerHTML = "<p>No outlines added yet.</p>";
        return;
      }
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const outlineBox = document.createElement("div");
        outlineBox.className = "outline-box";
        outlineBox.innerHTML = `
          <p><b>Lab Name:</b> ${data.labName}</p>
          <p><b>Block No:</b> ${data.blockNo}</p>
          <p><b>Floor No:</b> ${data.floorNo}</p>
          <p><b>Room No:</b> ${data.roomNo}</p>
        `;
        outlineList.appendChild(outlineBox);
      });
    })
    .catch((error) => {
      console.error("Error fetching outlines: ", error);
      outlineList.innerHTML = "<p>Error loading outlines.</p>";
    });
}

// ===============================
// Registration & Profile Functions
// ===============================
function saveRegistration(event) {
  event.preventDefault();  // ⛔ stop form auto reload

  const name = document.getElementById("username").value.trim();
  const regno = document.getElementById("registerNumber").value.trim();
  const branch = document.getElementById("branch").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const state = document.getElementById("State").value.trim();
  const district = document.getElementById("District").value.trim();
  const city = document.getElementById("City").value.trim();
  const instType = document.getElementById("schoolCheck").checked ? "School" : "College";
  const instName = document.getElementById("Institutions").value.trim();

  // Validation check
  if (!name || !regno || !branch || !email || !phone || !state || !district || !city || !instName) {
    alert("⚠️ Please fill all fields before registering!");
    return;
  }

  const data = { name, regno, branch, email, phone, state, district, city, instType, instName };

  db.collection("users").doc(regno).set(data)
    .then(() => {
      alert("✅ Registration saved successfully");
      localStorage.setItem("currentUser", data.regno); // Save session
      window.location.href = "home.html";  // redirect to home page
    })
    .catch((err) => {
      alert("❌ Error saving registration: " + err);
    });
}



function loadProfile(regno) {
  db.collection("users").doc(regno).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById('profileData').innerHTML = `
          <div class="label">Name</div><div>${data.name}</div>
          <div class="label">Register No</div><div>${data.regno}</div>
          <div class="label">Branch</div><div>${data.branch}</div>
          <div class="label">Email</div><div>${data.email}</div>
          <div class="label">Phone</div><div>${data.phone}</div>
          <div class="label">State</div><div>${data.state}</div>
          <div class="label">District</div><div>${data.district}</div>
          <div class="label">City</div><div>${data.city}</div>
          <div class="label">Institution</div><div>${data.instType} – ${data.instName}</div>
        `;
      } else {
        document.getElementById('profileData').innerHTML = "No profile found.";
      }
    });
}

function saveProfileEdit(regno) {
  const data = {
    name: document.getElementById("name").value,
    regno: document.getElementById("regno").value,
    branch: document.getElementById("branch").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    state: document.getElementById("state").value,
    district: document.getElementById("district").value,
    city: document.getElementById("city").value,
    instType: document.getElementById("instType").value,
    instName: document.getElementById("instName").value
  };
  db.collection("users").doc(regno).set(data)
    .then(() => {
      alert("Profile updated ✅");
      loadProfile(regno);
      cancelEdit();
    });
}

// ==============================
//login function
//===============================
function loginUser(event) {
  event.preventDefault();   // ⛔ stops auto submit

  const regno = document.getElementById("loginRegNo").value.trim();
  if (!regno) {
    alert("⚠️ Please enter your Register Number!");
    return;
  }

  db.collection("users").doc(regno).get()
    .then((doc) => {
      if (doc.exists) {
        localStorage.setItem("currentUser", regno);
        alert("Login successful ✅");
        window.location.href = "home.html";
      } else {
        alert("❌ Register number not found. Please register first.");
      }
    })
    .catch((err) => {
      alert("Error logging in: " + err);
    });
}



// ===============================
// Events Functions
// ===============================
function postEvent() {
  let category = document.getElementById("category").value;
  let program = document.getElementById("programName").value;
  let name = document.getElementById("eventName").value;
  let time = document.getElementById("eventTime").value;
  let venue = document.getElementById("eventVenue").value;
  let date = document.getElementById("eventDate").value;

  db.collection("events").add({
    category, program, name, time, venue, date,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    alert("Event Posted Successfully ✅");
    loadEvents();
  });
}

function loadEvents() {
  const techList = document.getElementById("technicalList");
  const cultList = document.getElementById("culturalList");
  if (!techList || !cultList) return;

  techList.innerHTML = "";
  cultList.innerHTML = "";

  db.collection("events").orderBy("timestamp","desc").get().then(snapshot=>{
    snapshot.forEach(doc=>{
      const e = doc.data();
      const html = `<div class="event-item">
        <strong>Program:</strong> ${e.program}<br>
        <strong>Event:</strong> ${e.name}<br>
        <strong>Time:</strong> ${e.time}<br>
        <strong>Venue:</strong> ${e.venue}<br>
        <strong>Date:</strong> ${e.date}
      </div>`;
      if(e.category=="technical") techList.innerHTML += html;
      else cultList.innerHTML += html;
    });
  });
}

// ===============================
// Announcement Functions
// ===============================
function postAnnouncement() {
  let announcement = document.getElementById('announcementText').value.trim();
  if(!announcement) return alert("Write an announcement!");

  db.collection("announcements").add({
    text: announcement,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById('announcementText').value = "";
    loadAnnouncements();
  });
}

function loadAnnouncements() {
  const list = document.getElementById('announcementList');
  if (!list) return;
  list.innerHTML = "";

  db.collection("announcements").orderBy("timestamp","desc").get()
    .then(snapshot=>{
      if(snapshot.empty) list.innerHTML="<li>No announcements yet.</li>";
      snapshot.forEach(doc=>{
        const item = document.createElement('li');
        item.textContent = doc.data().text;
        list.appendChild(item);
      });
    });
}

// ===============================
// Lost & Found Functions
// ===============================
function postLostFound() {
  const itemName = document.querySelector('#lostfound input[type="text"]').value;
  const description = document.querySelector('#lostfound textarea').value;

  db.collection("lostFound").add({
    itemName, description,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Item posted ✅");
    loadLostFound();
  });
}

function loadLostFound() {
  const list = document.querySelector('#lostfound .grid');
  if (!list) return;
  list.innerHTML = "";

  db.collection("lostFound").orderBy("timestamp","desc").get().then(snapshot=>{
    snapshot.forEach(doc=>{
      const data = doc.data();
      const div = document.createElement('div');
      div.className = "lost-item";
      div.innerHTML = `<h3>${data.itemName}</h3><p>${data.description}</p>`;
      list.appendChild(div);
    });
  });
}

// ===============================
// Init Loader (runs on page load)
// ===============================
window.addEventListener("load", () => {
  loadOutlines();
  loadEvents();
  loadAnnouncements();
  loadLostFound();
});
