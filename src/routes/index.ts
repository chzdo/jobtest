import express from "express";
import { handle404, handleResponse, checkServer } from "../middlewares/routeHandler";

import routerStars from "./starwars";

const router = express.Router();
router.use(checkServer);
router.use("/", routerStars);
router.use(handle404);
router.use(handleResponse);
export { router };
