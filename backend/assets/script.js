let currentPage = 1;
let currentGenre = null;
let currentKeyword = null;
let isLoading = false;
let lastArticleCount = 0;

function fetchMovies(isSearching) {
  if (isLoading) return;

  isLoading = true;
  let url;
  if (isSearching) {
    const keyword = document.getElementById("searchKeyword").value;
    url = `/movies?search=${keyword}`;
  } else {
    const genre = currentGenre || document.getElementById("genre").value;
    url = `/movies?genre=${genre}`;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const moviesContainer = document.getElementById("moviesContainer");
      if (currentPage === 1) {
        moviesContainer.innerHTML = "";
      }

      data.forEach((movie) => {
        const movieItem = `
          <div class="movieItem">
              <div class="movieItem">
              </div>
              <div class="movieContent">
                  <div class="info">
                      <h5>${movie.studio}</h5>
                      <span>|</span>
                      <h5>${movie.year}</h5>
                  </div>
                  <h2>${movie.film}</h2>
                  <p>${movie.genre}</p>
              </div>
          </div>
      `;
        moviesContainer.innerHTML += movieItem;
      });

      currentPage++;
      isLoading = false;
      displayNoMoreMovies();
    })
    .catch((error) => {
      console.error("There was an error fetching the movies:", error);
      isLoading = false;
    });
}

function displayNoMoreMovies() {
  const moviesContainer = document.getElementById("moviesContainer");
  moviesContainer.innerHTML += "<p>No more movies to load.</p>";
}

window.onscroll = function () {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 10
  ) {
    if (currentKeyword) {
      fetchMovies(true);
    } else {
      fetchMovies(false);
    }
  }
};

document
  .getElementById("searchKeyword")
  .addEventListener("input", function () {
    currentPage = 1;
    currentCategory = null;
    currentKeyword = this.value;
  });

document
  .getElementById("fetchGenre")
  .addEventListener("click", function () {
    currentPage = 1;
    currentKeyword = null;
    fetchMovies(false);
  });
