import { Response, Request, NextFunction } from "express";
import path from "path";
import { errResponseObjectType } from "../../types/index";

function checkServer(req: Request, res: Response, next: NextFunction): void {
 if (!globalThis.movies) {
  res.status(503).json({
   statusCode: 503,
   message: "Heroku still loading app. inactive shuts down.",
  });
  return;
 }
 next();
}

function handle404(req: Request, res: Response, next: NextFunction): void {
 res.sendFile(path.resolve(__dirname, "../../public/index.html"));
}

function handleResponse(
 responseObject: errResponseObjectType | any,
 req: Request,
 res: Response,
 next: NextFunction
): void {
 const statusCode = responseObject.statusCode || 500;
 res.set("Content-Type", "application/json");
 res.status(statusCode).json({
  statusCode,
  message: responseObject.message,
  ...responseObject,
 });
}

export { handle404, handleResponse, checkServer };
