// App.tsx
import { useState } from 'react';
import './App.css';

export interface IMovieItem {
  id: number;
  film: string;
  genre: string;
  studio: string;
  score: number;
  profitability: number;
  rotten_score: number;
  gross: number;
  year: number;
}

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<IMovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchMovies = async () => {
    if (query) {
      const url = `http://localhost:8000/movies?search=${query}`;
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data);
      setIsLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h1 className="text-center my-4">Movie Search</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search for movies"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchMovies();
            }
          }}
        />
       <div className="input-group-append">
          <button className="btn btn-primary" onClick={searchMovies} disabled={isLoading}>
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Loading...</span>
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>
      <div className="list-container">
        <div className="list-group">
          {movies.map((movie, _index) => (
            <div className="list-group-item" key={movie.id}>
              <h5 className="title-text">{movie.film}</h5>
              <p>
                <span>Studio: {movie.studio}</span>
                <span>Genre: {movie.genre}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
