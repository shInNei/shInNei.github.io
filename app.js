// Configurable User details
const config = {
  myName: "Nguyen Huu Huy Thinh", // Highlights this name in project member lists
};


// State Variables
let projectsData = [];
let currentFilter = "all";
let currentSearchQuery = "";

// DOM Elements
const projectsTimeline = document.getElementById("projects-timeline");
const searchInput = document.getElementById("project-search");
const filterTabs = document.querySelectorAll(".filter-tab");

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

// Fetch Projects from JSON Database
async function loadProjectsDatabase() {
  try {
    const response = await fetch("projects.json?v=1.7&t=" + new Date().getTime(), { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    projectsData = await response.json();
    console.log("Successfully loaded projects database from projects.json");
  } catch (error) {
    console.error("Failed to load projects.json:", error);
  }
  renderTimeline();
}

// Render Projects List (Flat list sorted by year/id)
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

  // 2. Sort Projects (Order by category: Academic -> Industry -> Personal, then by year descending and id descending)
  const categoryOrder = { academic: 1, industry: 2, personal: 3 };
  const sortedProjects = filteredProjects.sort((a, b) => {
    const orderA = categoryOrder[a.type] || 99;
    const orderB = categoryOrder[b.type] || 99;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    if (b.year !== a.year) {
      return b.year - a.year;
    }
    return b.id - a.id;
  });

  // 3. Render Cards
  sortedProjects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.setAttribute("data-type", project.type);

    // Category Label
    const typeLabel = project.type.charAt(0).toUpperCase() + project.type.slice(1);

    // Action Links (Clean labels without square brackets)
    let linksHTML = "";
    if (project.links) {
      if (project.links.page) linksHTML += `<a href="${project.links.page}" target="_blank" rel="noopener noreferrer" class="card-link">Project Page</a>`;
      if (project.links.pdf_vie) linksHTML += `<a href="${project.links.pdf_vie}" target="_blank" rel="noopener noreferrer" class="card-link">Paper (Vie)</a>`;
      if (project.links.pdf_eng) linksHTML += `<a href="${project.links.pdf_eng}" target="_blank" rel="noopener noreferrer" class="card-link">Paper (Eng)</a>`;
      if (project.links.summary_eng) linksHTML += `<a href="${project.links.summary_eng}" target="_blank" rel="noopener noreferrer" class="card-link">Summary (Eng)</a>`;
      if (project.links.pdf && !project.links.pdf_vie && !project.links.pdf_eng) linksHTML += `<a href="${project.links.pdf}" target="_blank" rel="noopener noreferrer" class="card-link">PDF</a>`;
      if (project.links.code) linksHTML += `<a href="${project.links.code}" target="_blank" rel="noopener noreferrer" class="card-link">Code</a>`;
      if (project.links.dataset) linksHTML += `<a href="${project.links.dataset}" target="_blank" rel="noopener noreferrer" class="card-link">Dataset</a>`;
      if (project.links.doi) linksHTML += `<a href="${project.links.doi}" target="_blank" rel="noopener noreferrer" class="card-link">DOI</a>`;
      if (project.links.demo) linksHTML += `<a href="${project.links.demo}" target="_blank" rel="noopener noreferrer" class="card-link">Demo</a>`;
    }

    // Apply specific CSS class if the thumbnail needs object-fit: contain
    let fitClass = "";
    if (project.title.toLowerCase().includes("chip-8")) {
      fitClass = "fit-contain";
    } else if (project.title.toLowerCase().includes("arrival time") || (project.image && project.image.includes("thesis"))) {
      fitClass = "fit-contain-white";
    }

    card.innerHTML = `
      <div class="card-thumbnail-container">
        <img src="${project.image}" alt="${project.title}" class="card-thumbnail-img ${fitClass}" 
             onerror="this.classList.add('hide'); this.nextElementSibling.classList.remove('hide');">
        <div class="card-thumbnail-fallback fallback-${project.type} hide">
          <span class="fallback-icon">${getFallbackIcon(project.type)}</span>
          <span class="fallback-type">${typeLabel}</span>
        </div>
      </div>
      <div class="card-content">
        <h3 class="card-title">${project.title}</h3>
        <div class="card-tags-row">
          <span class="card-tag tag-${project.type}">${typeLabel}</span>
          ${project.company ? `<span class="card-tag tag-company">${project.company}</span>` : ""}
          ${project.tag ? `<span class="card-tag tag-green">${project.tag}</span>` : ""}
          <span class="card-tag tag-year">${project.year}</span>
        </div>
        <p class="card-description">${project.description}</p>
        <div class="card-footer-links">
          ${linksHTML}
        </div>
      </div>
    `;

    projectsTimeline.appendChild(card);

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

// Navbar link navigates to personal.html directly

// Initialize on DOM load
window.addEventListener("DOMContentLoaded", () => {
  loadProjectsDatabase();
});
