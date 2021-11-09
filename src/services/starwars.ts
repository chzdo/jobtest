import { errResponseObjectType, successResponseObjectType } from "../../types";

import { create, findAll } from "../controller/__config";

import { processError, processFailedResponse, processResponse } from "../response/__config";

import { Request } from "express";

const { comments } = globalThis.db;

const service = "star wars";

async function getCharacters(req: Request): Promise<errResponseObjectType | successResponseObjectType> {
 try {
  const { query, params } = req;

  const movieId = params.movieId;

  const { movies } = globalThis.movies;

  if (!movieId) {
   return processFailedResponse(422, "Movie ID Required", service);
  }

  const movie = movies.find((value) => value.episode_id == movieId);

  if (!movie) {
   return processFailedResponse(404, "Movie No Found", service);
  }

  let { characters } = movie;

  const { sort, filter } = query;

  if (sort) {
   const [field, type] = sort.toString().split(":");

   characters = characters.sort((a, b) => {
    if (type === "1") {
     if (isNaN(parseInt(a[field]))) {
      return a[field].toString().localeCompare(b[field]);
     }

     return parseInt(a[field]) - parseInt(b[field]);
    } else {
     if (isNaN(parseInt(a[field]))) {
      return b[field].toString().localeCompare(a[field]);
     }
     return parseInt(b[field]) - parseInt(a[field]);
    }
   });
  }

  if (filter) {
   const [field, val] = filter.toString().split(":");
   characters = characters.filter((value) => value[field] === val);
  }

  const noOfCharacters = characters.length;
  const totalHeightinCm = characters.reduce((prev, cur) => {
   const s = parseFloat(cur.height);
   return !isNaN(s) ? prev + s : prev;
  }, 0);
  const totalHeightinFeet = converttoFeet(totalHeightinCm);

  const metaData = {
   noOfCharacters,
   totalHeightinCm,
   totalHeightinFeet,
  };

  const payload = { metaData, characters };

  return processResponse(200, payload);
 } catch (e: unknown) {
  return processError(e, service);
 }
}

async function addComment(req: Request): Promise<errResponseObjectType | successResponseObjectType> {
 try {
  const { comment, episode_id } = req.body;

  const { ids } = globalThis.movies;

  if (!episode_id) {
   return processFailedResponse(422, "Movie ID Required", service);
  }

  if (ids.findIndex((value) => value == episode_id) == -1) {
   return processFailedResponse(422, "Invalid Movie ID", service);
  }
  if (!comment) {
   return processFailedResponse(422, "Comment Required", service);
  }

  if (comment.length > 500) {
   return processFailedResponse(422, "Inavlid comment", service);
  }
  const xff = req.headers["x-forwarded-for"];

  const ip = req.socket.remoteAddress || (Array.isArray(xff) ? xff[0] : xff);

  const response = await create(
   {
    movieId: episode_id,
    comment,
    ip,
   },
   comments
  );

  return processResponse(200, response);
 } catch (e: unknown) {
  return processError(e, service);
 }
}

async function getMovies(req: Request): Promise<errResponseObjectType | successResponseObjectType> {
 try {
  const { ids, movies, count } = globalThis.movies;

  if (count > 0) {
   const commentList = await findAll(
    {
     query: {
      movieId: ids.join(":"),
      sort: "createdAt:DESC",
      project: "createdAt,id,comment,ip,movieId",
     },
    },
    comments
   );

   const response = movies.map((movie: any) => {
    const { title, opening_crawl, episode_id, release_date } = movie;

    const comment = commentList.filter((v) => {
     return v["movieId"] == episode_id;
    });

    return { title, opening_crawl, episode_id, release_date, noOfComments: comment.length, comment };
   });

   return processResponse(200, response);
  }

  return processFailedResponse(404, "not found", service);
 } catch (e: unknown) {
  return processError(e, service);
 }
}

async function getMoviesbyId(req: Request): Promise<errResponseObjectType | successResponseObjectType> {
 try {
  const { movieId } = req.params;

  if (!movieId) {
   return processFailedResponse(422, "Movied ID Required", service);
  }
  const { movies } = globalThis.movies;
  const movie = movies.find((value) => value.episode_id == movieId);

  if (!movie) return processFailedResponse(404, "Movie not found", service);

  const commentList = await findAll(
   {
    query: {
     movieId,
     sort: "createdAt:DESC",
     project: "createdAt,id,comment,ip,movieId",
    },
   },
   comments
  );

  movie["noOfComments"] = commentList.length;
  movie["comment"] = commentList;

  return processResponse(200, movie);
 } catch (e: unknown) {
  return processError(e, service);
 }
}

function converttoFeet(cm) {
 const inch = parseFloat(cm) / 2.54;

 const feet = inch / 12;

 const finalInch = inch - 4 * 12;

 return `${feet.toFixed(2)}ft ${finalInch.toFixed(2)}In`;
}

export { getMovies, addComment, getCharacters, getMoviesbyId };
