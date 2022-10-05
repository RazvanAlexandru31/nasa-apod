const resultsNav = document.getElementById("resultsNav");
const favoriteNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const savedConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count} `;
// pass in what we get from api in resultsArray
let resultsArray = [];
let favorites = {};

function showContent(page) {
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoriteNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoriteNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

function createDOM(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    // Card container
    const card = document.createElement("div");
    card.classList.add("card");

    // Link for image
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";

    // Image itself
    const img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = result.url;
    img.alt = "NASA Image Of The Day";
    img.loading = "lazy";

    // Card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Title of the card
    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = result.title;

    // Add to favorites clickable
    const favoriteText = document.createElement("p");
    favoriteText.classList.add("clickable");
    if (page === "results") {
      favoriteText.textContent = "Add To Favorites";
      favoriteText.setAttribute("onclick", `saveFavorite("${result.url}")`);
    } else {
      favoriteText.textContent = "Remove From Favorites";
      favoriteText.setAttribute("onclick", `removeFavorite("${result.url}")`);
    }

    // Card text
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = result.explanation;

    // Footer Container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");

    // Date
    const date = document.createElement("strong");
    date.textContent = result.date;

    // Copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;

    // Append
    footer.append(date, copyright);
    cardBody.append(title, favoriteText, cardText, footer);

    link.appendChild(img);

    card.append(link, cardBody);

    console.log(card);

    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  // get favorites from local storage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
    console.log("this is from local storage: ", favorites);
  }
  imagesContainer.textContent = "";
  createDOM(page);
  showContent(page);
}

// Add card to favorites
function saveFavorite(itemUrl) {
  console.log(itemUrl);
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // console.log(favorites);
      // console.log(JSON.stringify(favorites));
      // show ADDED! message
      savedConfirmed.classList.remove("hidden");

      // remove ADDED! message after 1.5 sec
      setTimeout(() => {
        savedConfirmed.classList.add("hidden");
      }, 1500);

      // set favorites in local storage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

// Remove item from favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}
// Get images from NASA API
async function getNasaPictures() {
  //show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    console.log(resultsArray);
    updateDOM("results");
  } catch (error) {
    console.log(error);
  }
}

getNasaPictures();
