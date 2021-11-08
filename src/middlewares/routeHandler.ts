import { Response, Request, NextFunction } from "express";
import { errResponseObjectType } from "../../types/index";

function checkServer(req: Request, res: Response, next: NextFunction): void {
 if (!globalThis.movies) {
  res.status(503).json({
   statusCode: 503,
   message: "Service loading try again",
  });
  return;
 }
 next();
}

function handle404(req: Request, res: Response, next: NextFunction): void {
 const responseObject: errResponseObjectType = { statusCode: 404, success: false, message: "Page not found" };
 next(responseObject);
}

function handleResponse(
 responseObject: errResponseObjectType | any,
 req: Request,
 res: Response,
 next: NextFunction
): void {
 const statusCode = responseObject.statusCode || 500;
 res.status(statusCode).json({
  statusCode,
  message: responseObject.message,
  ...responseObject,
 });
}

export { handle404, handleResponse, checkServer };
