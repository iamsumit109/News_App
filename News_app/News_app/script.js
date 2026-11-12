const API_KEY = "pub_58d681e29ef047c8a082775d0aced28f";

const searchform = document.getElementById("searchform");
const searchinput = document.getElementById("searchinput");
const message = document.getElementById("msg");
const result = document.getElementById("result");
const pageTitle = document.getElementById("page-title");
const categoryLinks = document.querySelectorAll("[data-category]");

let selectedCategory = "";

async function getNews(searchTerm) {
    message.textContent = "Loading news...";
    result.replaceChildren();

    let url = "https://newsdata.io/api/1/latest?apikey="+API_KEY+"&language=en";

    if (searchTerm !== "") {
        url += "&q=" + encodeURIComponent(searchTerm);
    }

    if (selectedCategory !== "") {
        url += "&category=" + encodeURIComponent(selectedCategory);
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "error" || !response.ok) {
            message.textContent = data.message || "Could not load news. Please try again.";
            return;
        }

        if (!data.results || data.results.length === 0) {
            message.textContent = "No news found. Try a different search.";
            return;
        }

        message.textContent = "Showing " + data.results.length + " news stories.";
        showNews(data.results);
    } catch (error) {
        message.textContent = "Could not load news. Check your internet connection and try again.";
    }
}

function showNews(articles) {
    for (const article of articles) {
        const card = document.createElement("article");
        card.className = "news-card";

        if (article.image_url) {
            const image = document.createElement("img");
            image.src = article.image_url;
            image.alt = "";
            image.onerror = function () {
                image.remove();
            };
            card.appendChild(image);
        }

        const title = document.createElement("h2");
        title.textContent = article.title || "Untitled story";
        card.appendChild(title);

        const description = document.createElement("p");
        description.textContent = article.description || "No description is available.";
        card.appendChild(description);

        let storyInfo = article.source_name || "";

        if (Array.isArray(article.category) && article.category.length > 0) {
            storyInfo += " | " + article.category[0];
        }

        if (article.pubDate) {
            storyInfo += " | " + article.pubDate;
        }

        if (storyInfo !== "") {
            const source = document.createElement("p");
            source.className = "news-source";
            source.textContent = storyInfo;
            card.appendChild(source);
        }

        if (article.link) {
            const link = document.createElement("a");
            link.href = article.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Read full story";
            card.appendChild(link);
        }

        result.appendChild(card);
    }
}

searchform.addEventListener("submit", function (event) {
    event.preventDefault();
    getNews(searchinput.value.trim());
});

categoryLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        selectedCategory = link.dataset.category;

        if (selectedCategory === "") {
            pageTitle.textContent = "Latest News";
        } else {
            pageTitle.textContent = selectedCategory[0].toUpperCase() + selectedCategory.slice(1) + " News";
        }

        categoryLinks.forEach(function (categoryLink) {
            categoryLink.classList.remove("active");
            categoryLink.removeAttribute("aria-current");
        });

        link.classList.add("active");
        link.setAttribute("aria-current", "page");
        getNews(searchinput.value.trim());
    });
});

getNews("");
