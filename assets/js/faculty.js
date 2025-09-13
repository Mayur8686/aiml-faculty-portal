// Faculty Data
const facultyData = [
  {
    name: "Dr. Swati Deshmukh",
    role: "Head of Department",
    school: "CSE - AI & ML",
    description: "Dr. Swati has over 15 years of teaching and research experience in Artificial Intelligence and Data Science. Her research includes deep learning and computer vision.",
    image: "https://github.com/VishalMache/Website_ai-ml/blob/main/AI&ML%20Faculty%5B1%5D/AI&ML%20Faculty/Swati%20Shirke.png?raw=true",
    linkedin: "https://www.linkedin.com/",
    website: "#"
  },
  {
    name: "Dr. Rahul Sonkamble",
    role: "Assistant Professor",
    school: "CSE - AI & ML",
    description: "Expert in Machine Learning and Software Engineering, with publications in reputed journals.",
    image: "https://github.com/VishalMache/Website_ai-ml/blob/main/AI&ML%20Faculty%5B1%5D/AI&ML%20Faculty/Rahul%20Sonkamble.png?raw=true",
    linkedin: "https://www.linkedin.com/",
    website: "#"
  },
  {
    name: "Dr. Yudhishthir Raut",
    role: "Assistant Professor",
    school: "CSE - AI & ML",
    description: "Research interests include AI-driven healthcare systems and neural networks.",
    image: "https://github.com/VishalMache/Website_ai-ml/blob/main/AI&ML%20Faculty%5B1%5D/AI&ML%20Faculty/Dr.Yudhishthir%20Raut.png?raw=true",
    linkedin: "https://www.linkedin.com/",
    website: "#"
  }
  // 👉 Add more here in same format
];

// Render Faculty Cards
const facultyGrid = document.getElementById("facultyGrid");

facultyData.forEach((faculty, index) => {
  const card = document.createElement("div");
  card.classList.add("faculty-card");
  card.innerHTML = `
    <img src="${faculty.image}" alt="${faculty.name}" class="faculty-img">
    <h3 class="faculty-name">${faculty.name}</h3>
    <p class="faculty-role">${faculty.role}</p>
    <div class="faculty-icons">
      <a href="${faculty.linkedin}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn"></a>
      <a href="${faculty.website}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/841/841364.png" alt="Website"></a>
    </div>
    <button class="view-details-btn" onclick="openModal(${index})">View Details</button>
  `;
  facultyGrid.appendChild(card);
});

// Open Modal
function openModal(index) {
  const faculty = facultyData[index];
  document.getElementById("modalImage").src = faculty.image;
  document.getElementById("modalName").textContent = faculty.name;
  document.getElementById("modalRole").textContent = faculty.role;
  document.getElementById("modalSchool").textContent = faculty.school;
  document.getElementById("modalDescription").textContent = faculty.description;
  document.getElementById("modalLinkedinIcon").href = faculty.linkedin;
  document.getElementById("modalWebsiteIcon").href = faculty.website;
  document.getElementById("websiteBtn").href = faculty.website;

  document.getElementById("facultyModal").style.display = "block";
}

// Close Modal
function closeModal() {
  document.getElementById("facultyModal").style.display = "none";
}

// Close when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById("facultyModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
