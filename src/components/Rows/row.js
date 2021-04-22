import React, { useState, useEffect } from "react";

import "./row.css";

import axios from "../../Axios/axios";

import Youtube from "react-youtube";

import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

// Row component
function Row({ title, fetchUrl, isLargeRow }) {
  // creating a movie state(short time memory)
  const [movies, setMovies] = useState([]);

  /* Creating a trailer state (short term memory) */
  const [trailerUrl, setTrailerUrl] = useState("");

  //   Pulling information from tmdb API when the pages loads
  useEffect(() => {
    //Running async call
    async function fetchData() {
      // Waiting for the promise to come back with movie results, fetchURL(outside the code block)
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
    // if [] is blank , run once when the row loads and don't run again
  }, [fetchUrl]);

  console.log(movies);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  //   When user clicks on the movie picture

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      // Search for movie trailer full url

      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      {/* title for posters */}
      <h2>{title}</h2>
      {/* containers for posters */}
      <div className="row_posters">
        {/* several row poster */}
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && `row_posterLarge`}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
