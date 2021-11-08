import express from "express";
import { Request, Response, NextFunction } from "express";
import { getMovies, addComment, getCharacters } from "../services/starwars";
const routerStarwars = express.Router();

routerStarwars.post("/:movieId/comment", async function (req: Request, res: Response, next: NextFunction) {
 const result = await addComment(req);
 next(result);
});

routerStarwars.get("/", async function (req: Request, res: Response, next: NextFunction) {
 const result = await getMovies(req);
 next(result);
});

routerStarwars.get("/:movieId/characters", async function (req: Request, res: Response, next: NextFunction) {
 const result = await getCharacters(req);
 next(result);
});

routerStarwars.get("/:movieId", async function (req: Request, res: Response, next: NextFunction) {
 const result = await getCharacters(req);
 next(result);
});

export default routerStarwars;
