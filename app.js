// Configurable User details
const config = {
  myName: "Nguyen Huu Huy Thinh", // Highlights this name in project member lists
};

// Fallback data structure for local loading when CORS blocks fetch() on file:// protocol
const fallbackProjectsData = [
  {
    "id": 1,
    "title": "POI CL-TTE: A Novel Deep Learning Architecture for Travel Time Estimation",
    "description": "Proposed and developed POI CL-TTE, a novel deep learning architecture for travel time estimation. Independently constructed a comprehensive trajectory dataset for Ho Chi Minh City from scratch, on which the proposed POI CL-TTE successfully outperformed the state-of-the-art baseline (MulT-TTE). Successfully defended with an outstanding grade of 9.36/10.",
    "members": ["Nguyen Huu Huy Thinh"],
    "type": "academic",
    "status": "Defended",
    "year": 2026,
    "keywords": ["Deep Learning", "Spatio-Temporal", "ETA Estimation"],
    "image": "assets/poi_cl_tte.jpg",
    "links": {
      "pdf": "papers/graduation_thesis.pdf",
      "code": "https://github.com/shInNei/POI-CL-TTE"
    }
  },
  {
    "id": 2,
    "title": "Travel Time Prediction (Capstone Project)",
    "description": "Implemented Transformer-based architectures to enhance travel time estimation accuracy using real-time spatio-temporal traffic data. Collected and constructed a dataset for Ho Chi Minh City from Waze API data, including data cleaning and feature extraction for ETA modeling.",
    "members": ["Nguyen Huu Huy Thinh"],
    "type": "personal",
    "status": "Completed",
    "year": 2026,
    "keywords": ["Transformers", "PyTorch", "Waze API"],
    "image": "assets/travel_time_prediction.jpg",
    "links": {
      "pdf": "papers/travel_time_report.pdf",
      "code": "https://github.com/shInNei/travel-time-prediction"
    }
  },
  {
    "id": 6,
    "title": "Nihonghub: Interactive Web Application for Japanese Learning",
    "description": "Developed Nihonghub, an interactive web application designed for Japanese language learning through video content, utilizing ReactJS, Python, and PostgreSQL. Actively engaged in the software development process, familiarizing with standard corporate workflows and Japanese business etiquette during a software development internship at NEC Vietnam.",
    "members": ["Nguyen Huu Huy Thinh"],
    "type": "industry",
    "status": "Active",
    "year": 2026,
    "keywords": ["ReactJS", "Python", "PostgreSQL"],
    "image": "assets/nihonghub.jpg",
    "links": {
      "code": "https://github.com/shInNei/nihonghub"
    }
  },
  {
    "id": 3,
    "title": "Deep Learning Control for a 4-Axis Robot Arm in Automated Plastering",
    "description": "Designed an automated plastering robot control system at the Visual Computing Lab, KIT (Japan). Developed a deep learning model to enable the 4-axis robot arm to achieve precise plastering in hard-to-reach wall areas. Published in the 30th IEEE/ACIS SNPD 2025 conference.",
    "members": ["Nguyen Huu Huy Thinh"],
    "type": "academic",
    "status": "Published",
    "year": 2025,
    "keywords": ["Robotics", "Deep Learning", "Computer Vision"],
    "image": "assets/plastering_robot.jpg",
    "links": {
      "pdf": "papers/plastering_robot.pdf",
      "doi": "https://doi.org/10.1109/SNPD.2025.000"
    }
  },
  {
    "id": 4,
    "title": "Old Photo Restoration",
    "description": "Gained hands-on experience in fine-tuning generative models on custom datasets using GFPGAN. Implemented image restoration and super-resolution pipelines using deep learning and image processing tools.",
    "members": ["Nguyen Huu Huy Thinh"],
    "type": "personal",
    "status": "Completed",
    "year": 2025,
    "keywords": ["Generative Models", "GFPGAN", "Image Processing"],
    "image": "assets/photo_restoration.jpg",
    "links": {
      "code": "https://github.com/shInNei/old-photo-restoration"
    }
  },
  {
    "id": 5,
    "title": "WebGL Shading Simulator",
    "description": "Built an interactive WebGL application demonstrating Flat, Gouraud, and Phong shading to develop strong 3D graphics and shader programming skills. Utilizes raw WebGL contexts, custom shader scripts, and matrix mathematics.",
    "members": ["Nguyen Huu Huy Thinh"],
    "type": "personal",
    "status": "Completed",
    "year": 2025,
    "keywords": ["WebGL", "Computer Graphics", "Shader Programming"],
    "image": "assets/webgl_shading.jpg",
    "links": {
      "code": "https://github.com/shInNei/webgl-shading-simulator",
      "page": "https://shInNei.github.io/webgl-shading-simulator"
    }
  }
];

// State Variables
let projectsData = [];
let currentFilter = "all";
let currentSearchQuery = "";

// DOM Elements
const projectsTimeline = document.getElementById("projects-timeline");
const searchInput = document.getElementById("project-search");
const filterTabs = document.querySelectorAll(".filter-tab");
const navPersonalFilter = document.getElementById("nav-personal-filter");

// Helper to match icons to project types for fallbacks
function getFallbackIcon(type) {
  switch (type) {
    case "academic":
      return "📚";
    case "industry":
      return "💼";
    case "personal":
      return "🛠️";
    default:
      return "📁";
  }
}

// Fetch Projects from JSON Database with automatic fallback for local files (CORS safety)
async function loadProjectsDatabase() {
  try {
    const response = await fetch("projects.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    projectsData = await response.json();
    console.log("Successfully loaded projects database from projects.json");
  } catch (error) {
    console.warn("Failed to load projects.json (likely due to local CORS block on file://). Loading local fallback data instead.", error);
    projectsData = fallbackProjectsData;
  }
  renderTimeline();
}

// Group and Render Timeline
function renderTimeline() {
  // Clear timeline container
  projectsTimeline.innerHTML = "";

  // 1. Filter Projects
  const filteredProjects = projectsData.filter(project => {
    // Category Filter
    const matchesFilter = currentFilter === "all" || project.type === currentFilter;
    
    // Search Filter
    const query = currentSearchQuery.toLowerCase().trim();
    if (!query) return matchesFilter;
    
    const matchesTitle = project.title.toLowerCase().includes(query);
    const matchesDesc = project.description.toLowerCase().includes(query);
    const matchesMembers = project.members.some(member => member.toLowerCase().includes(query));
    const matchesKeywords = project.keywords.some(keyword => keyword.toLowerCase().includes(query));
    
    return matchesFilter && (matchesTitle || matchesDesc || matchesMembers || matchesKeywords);
  });

  // Empty State Check
  if (filteredProjects.length === 0) {
    projectsTimeline.innerHTML = `
      <div class="empty-state">
        <p>No projects or publications found matching your criteria.</p>
      </div>
    `;
    return;
  }

  // 2. Group by Year Descending
  const groups = {};
  filteredProjects.forEach(project => {
    const year = project.year || "Other";
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(project);
  });

  // Get sorted years (descending)
  const sortedYears = Object.keys(groups).sort((a, b) => {
    if (a === "Other") return 1;
    if (b === "Other") return -1;
    return b - a;
  });

  // 3. Render Groups
  sortedYears.forEach(year => {
    const timelineGroup = document.createElement("div");
    timelineGroup.className = "timeline-group";

    // Create Year Column
    const yearColumn = document.createElement("div");
    yearColumn.className = "timeline-year";
    yearColumn.textContent = year;
    timelineGroup.appendChild(yearColumn);

    // Create Projects List Column
    const projectsListColumn = document.createElement("div");
    projectsListColumn.className = "timeline-projects";

    // Render Cards in this year
    // Sort projects within the year descending by ID
    const projectsInYear = groups[year].sort((a, b) => b.id - a.id);

    projectsInYear.forEach(project => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.setAttribute("data-type", project.type);

      // Bold your name in the authors/members list
      const formattedMembers = project.members.map(member => {
        if (member.toLowerCase() === config.myName.toLowerCase()) {
          return `<strong>${member}</strong>`;
        }
        return member;
      }).join(", ");

      // Category and Status Badges
      const typeLabel = project.type.charAt(0).toUpperCase() + project.type.slice(1);
      let tagsHTML = `
        <span class="card-tag tag-${project.type}">${typeLabel}</span>
        <span class="card-tag tag-status">${project.status}</span>
      `;
      project.keywords.forEach(keyword => {
        tagsHTML += `<span class="card-tag tag-keyword">${keyword}</span>`;
      });

      // Capitalized Action Links
      let linksHTML = "";
      if (project.links) {
        if (project.links.pdf) linksHTML += `<a href="${project.links.pdf}" target="_blank" rel="noopener noreferrer" class="card-link">[PDF]</a>`;
        if (project.links.code) linksHTML += `<a href="${project.links.code}" target="_blank" rel="noopener noreferrer" class="card-link">[CODE]</a>`;
        if (project.links.doi) linksHTML += `<a href="${project.links.doi}" target="_blank" rel="noopener noreferrer" class="card-link">[DOI]</a>`;
        if (project.links.page) linksHTML += `<a href="${project.links.page}" target="_blank" rel="noopener noreferrer" class="card-link">[PAGE]</a>`;
      }

      card.innerHTML = `
        <div class="card-thumbnail-container">
          <img src="${project.image}" alt="${project.title}" class="card-thumbnail-img" 
               onerror="this.classList.add('hide'); this.nextElementSibling.classList.remove('hide');">
          <div class="card-thumbnail-fallback fallback-${project.type} hide">
            <span class="fallback-icon">${getFallbackIcon(project.type)}</span>
            <span class="fallback-type">${typeLabel}</span>
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${project.title}</h3>
          <p class="card-description">${project.description}</p>
          <div class="card-members">${formattedMembers}</div>
          <div class="card-footer">
            <div class="card-footer-tags">
              ${tagsHTML}
            </div>
            <div class="card-footer-links">
              ${linksHTML}
            </div>
          </div>
        </div>
      `;

      projectsListColumn.appendChild(card);

      // Verify if images are loaded successfully, fallback immediately if failed
      const img = card.querySelector(".card-thumbnail-img");
      if (img && (!img.complete || img.naturalWidth === 0)) {
        setTimeout(() => {
          if (img.naturalWidth === 0) {
            img.classList.add('hide');
            card.querySelector(".card-thumbnail-fallback").classList.remove('hide');
          }
        }, 50);
      }
    });

    timelineGroup.appendChild(projectsListColumn);
    projectsTimeline.appendChild(timelineGroup);
  });
}

// Event Listeners
searchInput.addEventListener("input", (e) => {
  currentSearchQuery = e.target.value;
  renderTimeline();
});

// Category Tabs selection handler
function selectFilterTab(filterValue) {
  filterTabs.forEach(tab => {
    if (tab.getAttribute("data-filter") === filterValue) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
  currentFilter = filterValue;
  renderTimeline();
}

filterTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const filter = tab.getAttribute("data-filter");
    selectFilterTab(filter);
  });
});

// Navbar "Personal" link triggers the "personal" tab filter and scrolls to timeline
navPersonalFilter.addEventListener("click", (e) => {
  e.preventDefault();
  selectFilterTab("personal");
  
  // Smooth scroll to timeline section
  const timelineSection = document.querySelector(".portfolio-section");
  if (timelineSection) {
    const offset = 80; // Margin below fixed navbar
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = timelineSection.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
});

// Initialize on DOM load
window.addEventListener("DOMContentLoaded", () => {
  loadProjectsDatabase();
});
