const apiKey = "7547c996b711ccc3f89de87c09a656a8";

function updateAssistant(message) {
  const textElement = document.getElementById("assistantText");
  textElement.innerText = "";

  let i = 0;
  const interval = setInterval(() => {
    textElement.innerText += message[i];
    i++;
    if (i >= message.length) clearInterval(interval);
  }, 25);
}


async function searchMovies() {
  const query = document.getElementById("searchInput").value;

  if (query === "") {
    updateAssistant("⚠️ Please type something first!");
    return;
  }

  updateAssistant("🔍 Searching for movies...");

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.results.length === 0) {
    updateAssistant("😕 Couldn't find anything. Try another movie!");
  } else {
    updateAssistant("🎬 Here are some movies I found!");
  }

  displayMovies(data.results);
}


function displayMovies(movies) {
  const container = document.getElementById("movieContainer");
  container.innerHTML = "";

  // Filter + Sort
  movies = movies.filter(movie => movie.vote_average > 5);
  movies.sort((a, b) => b.vote_average - a.vote_average);

  //handling no results
  if (movies.length === 0) {
    container.innerHTML = "<h2>No movies found, Try searching for other</h2>";
    updateAssistant("😕 No movies found. Try something else!");
    return;
  }

  movies.forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("movie");

    const poster = movie.poster_path 
      ? "https://image.tmdb.org/t/p/w500" + movie.poster_path 
      : "https://via.placeholder.com/200x300?text=No+Image";

    div.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="${poster}">
      <p>⭐ ${movie.vote_average}</p>
      <p>📅 ${movie.release_date}</p>
    `;

    div.onclick = () => {
      updateAssistant("📖 Showing movie details...");
      alert(movie.overview);
    };

    container.appendChild(div);
  });
}