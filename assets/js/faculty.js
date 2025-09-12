// Faculty data (you can add more fields if needed)
const facultyData = [
  {
    name: "Dr. Swati Deshmukh",
    role: "Head of Department",
    school: "CSE - AI & ML",
    image: "https://github.com/VishalMache/Website_ai-ml/blob/main/AI&ML%20Faculty%5B1%5D/AI&ML%20Faculty/Swati%20Shirke.png?raw=true",
    linkedin: "#",
    website: "#",
    description: "Dr. Swati Deshmukh is the Head of Department with expertise in Artificial Intelligence and Machine Learning."
  },
  {
    name: "Dr. Rahul Sonkamble",
    role: "Assistant Professor",
    school: "CSE - AI & ML",
    image: "https://github.com/VishalMache/Website_ai-ml/blob/main/AI&ML%20Faculty%5B1%5D/AI&ML%20Faculty/Rahul%20Sonkamble.png?raw=true",
    linkedin: "#",
    website: "#",
    description: "Specializes in Data Science and Neural Networks."
  },
  // Add more faculty objects here...
];

// Function to open modal with faculty info
function openModal(index) {
  const faculty = facultyData[index];

  // Fill modal content
  document.getElementById("modalImage").src = faculty.image;
  document.getElementById("modalName").innerText = faculty.name;
  document.getElementById("modalRole").innerText = faculty.role;
  document.getElementById("modalSchool").innerText = faculty.school;
  document.getElementById("modalDescription").innerText = faculty.description;

  // Links
  document.getElementById("modalLinkedinIcon").href = faculty.linkedin;
  document.getElementById("modalWebsiteIcon").href = faculty.website;
  document.getElementById("websiteBtn").href = faculty.website;

  // Show modal
  document.getElementById("facultyModal").style.display = "block";
}

// Function to close modal
function closeModal() {
  document.getElementById("facultyModal").style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById("facultyModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
}
