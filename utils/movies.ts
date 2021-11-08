import axios from "axios";
import { inspect } from "util";
import { logger } from "./winston";

const { STAR_URL } = process.env;

async function getMovies() {
 try {
  const { data } = await axios.get(STAR_URL);

  if (data) {
   const moviesList = [];
   for (const results of data.results) {
    const { title, opening_crawl, episode_id, release_date, characters } = results;
    const characterInfo = [];
    for (const character of characters) {
     try {
      const { name, gender, height, mass, hair_colour } = (await axios.get(character)).data;
      characterInfo.push({ name, gender, height, mass, hair_colour });
     } catch (e) {
      logger.error(e);
     }
    }

    moviesList.push({
     title,
     opening_crawl,
     episode_id,
     release_date,
     characters: characterInfo,
    });
   }

   const movies = {
    ids: moviesList.map((value) => value.episode_id),
    movies: moviesList,
    unfilteredMovies: data.results,
    count: data.count,
   };
   globalThis.movies = movies;
  }

  logger.info("server ready for request");
 } catch (e) {
  logger.error(e);
 }
}

getMovies();

export { getMovies };
