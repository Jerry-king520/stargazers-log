const repositoryList = document.querySelector("#repository-list");
const repositoryStatus = document.querySelector("#repository-status");
const repositoryCount = document.querySelector("#repository-count");

function createRepositoryItem(repository) {
  const item = document.createElement("li");
  item.className = "repository-item";

  const link = document.createElement("a");
  link.className = "repository-link";
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repository.name;

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = repository.description;

  const meta = document.createElement("div");
  meta.className = "repository-meta";

  const language = document.createElement("span");
  language.textContent = repository.language;

  const date = document.createElement("time");
  date.dateTime = repository.starred_at;
  date.textContent = `Starred ${new Date(`${repository.starred_at}T00:00:00`).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })}`;

  meta.append(language, date);
  item.append(link, description, meta);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new TypeError("Repository data must be an array.");
    }

    repositoryList.replaceChildren(...repositories.map(createRepositoryItem));
    repositoryCount.textContent = `${repositories.length} ${repositories.length === 1 ? "repository" : "repositories"}`;
    repositoryStatus.textContent = repositories.length ? "" : "No starred repositories yet.";
  } catch (error) {
    repositoryStatus.textContent = "Could not load repositories. Open this page through a local web server and try again.";
    console.error("Unable to load events.json:", error);
  }
}

loadRepositories();