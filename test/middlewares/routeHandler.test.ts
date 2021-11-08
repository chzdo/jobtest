import chai, { expect } from "chai";
import sinon from "sinon";
import { Request, Response, NextFunction } from "express";
import { handle404, handleResponse } from "../../src/middlewares/routeHandler";
import { inspect } from "util";

describe("test for route handlers", function () {
 it("checks if next is called when", function () {
  const next = sinon.spy();
  let req: Request;
  let res: Response;
  handle404(req, res, next);
  expect(next.callCount).to.be.equal(1);
 });
 it("returns the correct response ", function () {
  const next = sinon.spy();
  const req = {};
  let responseObject = {};
  const res: Partial<Response> = {
   status: sinon.stub().callsFake((code) => {
    this.code = code;
    return {
     json: sinon.stub().callsFake((result) => {
      responseObject = result;
      this.body = result;
      return this;
     }),
    };
   }),
  };
  const Object = {
   message: "test error",
  };

  const expectedResponse = {
   statusCode: 500,
   message: "test error",
  };

  handleResponse(Object, req as Request, res as Response, next);

  const stringifyResponse = inspect(responseObject, { depth: null });
  const stringifyExpectedResponse = inspect(expectedResponse, { depth: null });
  expect(stringifyResponse).to.be.equal(stringifyExpectedResponse);
  //.and.equal(expectedResponse);
 });
});
