import chai, { expect } from "chai";
import { ValidationResult, ValidationError } from "joi";

import sinon from "sinon";

import proxyquire from "proxyquire";
import { logger } from "../../utils/winston";
import { Model, ModelCtor } from "sequelize";
import { Request } from "express";
import { inspect } from "util";

//sinon.stub(globalThis);

globalThis.db = {
 testModels: sinon.stub(),
};
const { getMovies, addComment } = proxyquire("../../src/services/starwars", {
 "../controller/__config": require("../controller/__config.mock.ts"),
});

describe("test for test service", function () {
 describe("test for getMovies", function () {
  this.beforeEach(() => {
   sinon.createSandbox();
  });

  it("returns error count is not greate than zero", async function () {
   globalThis.movies = {
    count: 0,
   };

   sinon.stub(logger, "error");
   const req: Partial<Request> = {};
   const response = await getMovies(req as Request);

   chai.expect(response).to.haveOwnProperty("statusCode").and.is.equal(404);
   chai.expect(response).to.haveOwnProperty("success").and.is.false;
   chai.expect(response).to.haveOwnProperty("message").and.is.equal("not found");
  });
  it("returns 200 status if count > 0", async function () {
   globalThis.movies = {
    count: 2,
    ids: [1, 2, 4, 5],
    movies: [{}, {}],
   };

   sinon.stub(logger, "error");
   const req: Partial<Request> = {
    body: {},
   };
   const response = await getMovies(req as Request);
   chai.expect(response).to.haveOwnProperty("statusCode").and.is.equal(200);
   chai.expect(response).to.haveOwnProperty("success").and.is.true;
   chai.expect(response).to.haveOwnProperty("payload").to.be.an("array");
  });
  it("returns  500 on code error", async function () {
   globalThis.movies = {
    count: 2,

    movies: [{}, {}],
   };

   sinon.stub(logger, "error");
   const req: Partial<Request> = {
    body: {},
   };
   const response = await getMovies(req as Request);
   chai.expect(response).to.haveOwnProperty("statusCode").and.is.equal(500);
   chai.expect(response).to.haveOwnProperty("success").and.is.false;
  });
 });

 describe("test for  addComments", function () {
  this.beforeEach(() => {
   sinon.createSandbox();
  });

  it("it returns error if episode_id is undefined", async function () {
   globalThis.movies = {
    count: 0,
   };

   sinon.stub(logger, "error");
   const req: Partial<Request> = {
    body: {},
   };
   const response = await addComment(req as Request);

   chai.expect(response).to.haveOwnProperty("statusCode").and.is.equal(422);
   chai.expect(response).to.haveOwnProperty("success").and.is.false;
   chai.expect(response).to.haveOwnProperty("message").and.is.equal("Movie ID Required");
  });
  it("it returns error if episode_id is not found", async function () {
   globalThis.movies = {
    count: 2,
    ids: [1, 2, 4, 5],
    movies: [{}, {}],
   };

   sinon.stub(logger, "error");
   const req: Partial<Request> = {
    body: {
     episode_id: 8,
    },
   };
   const response = await addComment(req as Request);

   chai.expect(response).to.haveOwnProperty("statusCode").and.is.equal(404);
   chai.expect(response).to.haveOwnProperty("success").and.is.false;
   chai.expect(response).to.haveOwnProperty("message").and.is.equal("Invalid Movie ID");
  });

  it("it returns error if comment is undefined", async function () {
   globalThis.movies = {
    count: 2,
    ids: [1, 2, 4, 5],
    movies: [{}, {}],
   };

   sinon.stub(logger, "error");
   const req: Partial<Request> = {
    body: {
     episode_id: 1,
    },
   };
   const response = await addComment(req as Request);

   chai.expect(response).to.haveOwnProperty("statusCode").and.is.equal(422);
   chai.expect(response).to.haveOwnProperty("success").and.is.false;
   chai.expect(response).to.haveOwnProperty("message").to.be.equal("Comment Required");
  });
  it("it returns error if comment length is bigger than 500", async function () {
   globalThis.movies = {
    count: 2,
    ids: [1, 2, 4, 5],
    movies: [{}, {}],
   };

   sinon.stub(logger, "error");
   const req: Partial<Request> = {
    body: {
     episode_id: 1,
     comment: `V8 implements ECMAScript and WebAssembly, and runs on Windows 7 or later, macOS 10.12+, and Linux systems that use x64, IA-32, or ARM processors. Additional systems (IBM i, AIX) and processors (MIPS, ppcle64, s390x) are externally maintained, see ports. V8 can run standalone, or can be embedded into any C++ application.

V8 compiles and executes JavaScript source code, handles memory allocation for objects, and garbage collects objects it no longer needs.V8’s stop- the - world, generational, accurate garbage collector is one of the keys to V8’s performance.

JavaScript is commonly used for client - side scripting in a browser, being used to manipulate Document Object Model(DOM) objects for example.The DOM is not, however, typically provided by the JavaScript engine but instead by a browser.The same is true of V8 — Google Chrome provides the DOM.V8 does however provide all the data types, operators, objects and functions specified in the ECMA standard.

V8 enables any C++ application to expose its own objects and functions to JavaScript code.It’s up to you to decide on the objects and functions you would like to expose to JavaScript.
       V8 implements ECMAScript and WebAssembly, and runs on Windows 7 or later, macOS 10.12 +, and Linux systems that use x64, IA - 32, or ARM processors.Additional systems(IBM i, AIX) and processors(MIPS, ppcle64, s390x) are externally maintained, see ports.V8 can run standalone, or can be embedded into any C++ application.

V8 compiles and executes JavaScript source code, handles memory allocation for objects, and garbage collects objects it no longer needs.V8’s stop - the - world, generational, accurate garbage collector is one of the keys to V8’s performance.

JavaScript is commonly used for client - side scripting in a browser, being used to manipulate Document Object Model(DOM) objects for example.The DOM is not, however, typically provided by the JavaScript engine but instead by a browser.The same is true of V8 — Google Chrome provides the DOM.V8 does however provide all the data types, operators, objects and functions specified in the ECMA standard.

V8 enables any C++ application to expose its own objects and functions to JavaScript code.It’s up to you to decide on the objects and functions you would like to expose to JavaScript.V8 implements ECMAScript and WebAssembly, and runs on Windows 7 or later, macOS 10.12 +, and Linux systems that use x64, IA - 32, or ARM processors.Additional systems(IBM i, AIX) and processors(MIPS, ppcle64, s390x) are externally maintained, see ports.V8 can run standalone, or can be embedded into any C++ application.

V8 compiles and executes JavaScript source code, handles memory allocation for objects, and garbage collects objects it no longer needs.V8’s stop - the - world, generational, accurate garbage collector is one of the keys to V8’s performance.

JavaScript is commonly used for client - side scripting in a browser, being used to manipulate Document Object Model(DOM) objects for example.The DOM is not, however, typically provided by the JavaScript engine but instead by a browser.The same is true of V8 — Google Chrome provides the DOM.V8 does however provide all the data types, operators, objects and functions specified in the ECMA standard.

V8 enables any C++ application to expose its own objects and functions to JavaScript code.It’s up to you to decide on the objects and functions you would like to expose to JavaScript.
V8 implements ECMAScript and WebAssembly, and runs on Windows 7 or later, macOS 10.12+, and Linux systems that use x64, IA-32, or ARM processors. Additional systems (IBM i, AIX) and processors (MIPS, ppcle64, s390x) are externally maintained, see ports. V8 can run standalone, or can be embedded into any C++ application.

V8 compiles and executes JavaScript source code, handles memory allocation for objects, and garbage collects objects it no longer needs. V8’s stop-the-world, generational, accurate garbage collector is one of the keys to V8’s performance.

JavaScript is commonly used for client-side scripting in a browser, being used to manipulate Document Object Model (DOM) objects for example. The DOM is not, however, typically provided by the JavaScript engine but instead by a browser. The same is true of V8 — Google Chrome provides the DOM. V8 does however provide all the data types, operators, objects and functions specified in the ECMA standard.

V8 enables any C++ application to expose its own objects and functions to JavaScript code. It’s up to you to decide on the objects and functions you would like to expose to JavaScript.`,
    },
   };
   const response = await addComment(req as Request);

   chai.expect(response).to.haveOwnProperty("statusCode").and.is.equal(422);
   chai.expect(response).to.haveOwnProperty("success").and.is.false;
   chai.expect(response).to.haveOwnProperty("message").to.be.equal("Inavlid comment");
  });
 });

 this.afterEach(function () {
  sinon.restore();
 });
});
