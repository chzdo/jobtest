import chai, { expect } from "chai";
import { ValidationResult, ValidationError } from "joi";

import sinon from "sinon";

import { addUser } from "../../src/validators/test";
import { testModelInstance } from "../../types/sequelize";
import proxyquire from "proxyquire";
import { logger } from "../../utils/winston";
import { Model, ModelCtor } from "sequelize";
import { Request } from "express";

//sinon.stub(globalThis);

globalThis.db = {
 testModels: sinon.stub(),
};
const { addNewUser, getTestById, editUser, getAllUsers, deleteUser } = proxyquire("../../src/services/test", {
 "../controller/__config": require("../controller/__config.mock.ts"),
});

describe("test for test service", function () {
 describe("test for addNewUSer", function () {
  this.beforeEach(() => {
   sinon.createSandbox();
  });
  it("returns error if validation fails", async function () {
   const Errors: Partial<ValidationError> = { message: "Test Validation" };
   const validationResult: Partial<ValidationResult> = { error: Errors as ValidationError };
   sinon.stub(addUser, "validate").returns(validationResult as ValidationResult);
   sinon.stub(logger, "error");
   const body: Partial<testModelInstance> = {
    firstName: "stanley",
   };
   const response = await addNewUser(body as testModelInstance);

   chai.expect(response).to.haveOwnProperty("statusCode").and.is.equal(422);
   chai.expect(response).to.haveOwnProperty("success").and.is.false;
   chai.expect(response).to.haveOwnProperty("message").and.is.equal("Test Validation");
  });
 });

 it("returns error if user exist", async function () {
  const validationResult: Partial<ValidationResult> = {};
  sinon.stub(addUser, "validate").returns(validationResult as ValidationResult);
  sinon.stub(logger, "error");
  const body: Partial<testModelInstance> = {
   firstName: "Stanley",
  };
  const response = await addNewUser(body as testModelInstance);

  chai.expect(response).to.haveOwnProperty("statusCode").and.is.equal(400);
  chai.expect(response).to.haveOwnProperty("success").and.is.false;
  chai.expect(response).to.haveOwnProperty("message").and.is.equal("User already exist");
 });
 it("creates a new record", async function () {
  const validationResult: Partial<ValidationResult> = {};
  sinon.stub(addUser, "validate").returns(validationResult as ValidationResult);

  const body: Partial<testModelInstance> = {
   firstName: "stanley",
  };
  const response = await addNewUser(body as testModelInstance);

  chai.expect(response).to.haveOwnProperty("statusCode").and.is.equal(201);
  chai.expect(response).to.haveOwnProperty("success").and.is.true;
  chai.expect(response).to.haveOwnProperty("payload").and.to.haveOwnProperty("id");
 });
 it("catches code error and returns 500", async function () {
  sinon.stub(addUser, "validate");
  sinon.stub(logger, "error");
  const body: Partial<testModelInstance> = {
   firstName: "stanley",
  };
  const response = await addNewUser(body as testModelInstance);

  chai.expect(response).to.haveOwnProperty("statusCode").and.is.equal(500);
  chai.expect(response).to.haveOwnProperty("success").and.is.false;
  chai.expect(response).to.haveOwnProperty("message");
 });
 this.afterEach(() => {
  sinon.restore();
 });
});

describe("test for getTestById", function () {
 this.beforeEach(function () {
  sinon.createSandbox();
 });
 it("returns 404 if the user is not found", async function () {
  sinon.stub(logger, "error");
  const req: Partial<Request> = {
   params: {
    id: "90",
   },
   query: {},
  };

  const response = await getTestById(req as Request);

  expect(response).to.haveOwnProperty("statusCode").to.be.equal(404);
  expect(response).to.haveOwnProperty("success").to.be.false;
  expect(response).to.haveOwnProperty("message").to.be.equal("Resource not found");
 });
 it("returns 200 if the user is not found", async function () {
  sinon.stub(logger, "error");
  const req: Partial<Request> = {
   params: {
    id: "1",
   },
   query: {},
  };

  const response = await getTestById(req as Request);

  expect(response).to.haveOwnProperty("statusCode").to.be.equal(200);
  expect(response).to.haveOwnProperty("success").to.be.true;
  expect(response).to.haveOwnProperty("payload");
 });
 it("returns 500 if the errow is thrown", async function () {
  sinon.stub(logger, "error");
  const req: Partial<Request> = undefined;

  const response = await getTestById(req as Request);

  expect(response).to.haveOwnProperty("statusCode").to.be.equal(500);
  expect(response).to.haveOwnProperty("success").to.be.false;
  expect(response).to.haveOwnProperty("message");
 });

 this.afterEach(function () {
  sinon.restore();
 });
});

describe("test for edit User", function () {
 this.beforeEach(function () {
  sinon.createSandbox();
 });
 it("returns 404 if the user is not found", async function () {
  sinon.stub(logger, "error");
  const req: Partial<Request> = {
   params: {
    id: "90",
   },
   query: {},
  };

  const response = await editUser(req as Request);

  expect(response).to.haveOwnProperty("statusCode").to.be.equal(404);
  expect(response).to.haveOwnProperty("success").to.be.false;
  expect(response).to.haveOwnProperty("message").to.be.equal("User not found");
 });
 it("returns 200 if the user edited", async function () {
  sinon.stub(logger, "error");
  const req: Partial<Request> = {
   params: {
    id: "1",
   },
   query: {
    idL: "1",
   },
  };

  const response = await editUser(req as Request);

  expect(response).to.haveOwnProperty("statusCode").to.be.equal(200);
  expect(response).to.haveOwnProperty("success").to.be.true;
  expect(response).to.haveOwnProperty("payload");
 });
 it("returns 500 if the errow is thrown", async function () {
  sinon.stub(logger, "error");
  const req: Partial<Request> = undefined;

  const response = await editUser(req as Request);

  expect(response).to.haveOwnProperty("statusCode").to.be.equal(500);
  expect(response).to.haveOwnProperty("success").to.be.false;
  expect(response).to.haveOwnProperty("message");
 });

 this.afterEach(function () {
  sinon.restore();
 });
});

describe("test for getAllUsers User", function () {
 this.beforeEach(function () {
  sinon.createSandbox();
 });
 it("returns correct result", async function () {
  sinon.stub(logger, "error");
  const req: Partial<Request> = {
   params: {
    id: "90",
   },
   query: {},
  };

  const response = await getAllUsers(req as Request);

  expect(response).to.haveOwnProperty("statusCode").to.be.equal(200);
  expect(response).to.haveOwnProperty("success").to.be.true;
  expect(response).to.haveOwnProperty("payload").to.be.an("array");
 });

 it("returns 500 if the errow is thrown", async function () {
  sinon.stub(logger, "error");
  const req: Partial<Request> = undefined;

  const response = await getAllUsers(req as Request);

  expect(response).to.haveOwnProperty("statusCode").to.be.equal(500);
  expect(response).to.haveOwnProperty("success").to.be.false;
  expect(response).to.haveOwnProperty("message");
 });

 this.afterEach(function () {
  sinon.restore();
 });
});

describe("test for delete User", function () {
 this.beforeEach(function () {
  sinon.createSandbox();
 });
 it("returns 404 if the user is not found", async function () {
  sinon.stub(logger, "error");
  const req: Partial<Request> = {
   params: {
    id: "90",
   },
   query: {},
  };

  const response = await deleteUser(req as Request);

  expect(response).to.haveOwnProperty("statusCode").to.be.equal(404);
  expect(response).to.haveOwnProperty("success").to.be.false;
  expect(response).to.haveOwnProperty("message").to.be.equal("User not found");
 });
 it("returns 200 if the user edited", async function () {
  sinon.stub(logger, "error");
  const req: Partial<Request> = {
   params: {
    id: "1",
   },
  };

  const response = await deleteUser(req as Request);

  expect(response).to.haveOwnProperty("statusCode").to.be.equal(200);
  expect(response).to.haveOwnProperty("success").to.be.true;
  expect(response).to.haveOwnProperty("payload");
 });
 it("returns 500 if the errow is thrown", async function () {
  sinon.stub(logger, "error");
  const req: Partial<Request> = undefined;

  const response = await deleteUser(req as Request);

  expect(response).to.haveOwnProperty("statusCode").to.be.equal(500);
  expect(response).to.haveOwnProperty("success").to.be.false;
  expect(response).to.haveOwnProperty("message");
 });

 this.afterEach(function () {
  sinon.restore();
 });
});
