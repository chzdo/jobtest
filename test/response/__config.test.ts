import chai, { should } from "chai";
import sinon from "sinon";
import { processError, processFailedResponse, processResponse } from "../../src/response/__config";
import { logger } from "../../utils/winston";

describe("test for  error response processes", function () {
 beforeEach(function () {
  sinon.createSandbox();
 });
 describe("test for  error response processes", function () {
  beforeEach(function () {
   sinon.createSandbox();
  });
  it("sets message to be e when error is a string", function () {
   const error = "Test Error";
   const service = "test";
   sinon.stub(logger, "error");
   const response = processError(error, service);
   chai.expect(response).to.have.ownProperty("message").to.be.eql(error);
  });
  it("sets message to be e.message when error is instance of Error", function () {
   const error = new Error("test error");
   sinon.stub(logger, "error");
   const response = processError(error, "test service");

   chai.expect(response).to.have.ownProperty("message").to.be.eql("test error");
  });

  it("should log errors using logger", function () {
   const error = new Error("test error");

   const errorLogger = sinon.stub(logger, "error").callsFake(() => null);
   const service = "test";
   processError(error, service);

   chai.expect(errorLogger.called).to.have.true;
  });

  it("sets message to be e.message when error is instance of Error", function () {
   const error = new Error("test error");

   const errorLogger = sinon.stub(logger, "error").callsFake(() => null);
   const service = "test";
   processError(error, service);

   chai.expect(errorLogger.args[0][0]).to.have.equal(`[${service}] error - test error`);
  });
  afterEach(function () {
   sinon.restore();
  });
 });

 describe("test for  failed response processes", function () {
  beforeEach(function () {
   sinon.createSandbox();
  });

  it("returns corrected object response", function () {
   sinon.stub(logger, "error");
   const response = processFailedResponse(400, "test service", "test");

   chai.expect(response).property("success").to.be.false;
   chai.expect(response).property("statusCode").to.be.eql(400);
  });

  it("should log errors using logger", function () {
   const errorLogger = sinon.stub(logger, "error").callsFake(() => null);

   processFailedResponse(400, "test service", "test");

   chai.expect(errorLogger.called).to.have.true;
  });

  it("sets message to be e.message when error is instance of Error", function () {
   const errorLogger = sinon.stub(logger, "error").callsFake(() => null);

   processFailedResponse(400, "test service", "test");

   chai.expect(errorLogger.args[0][0]).to.have.equal(`[test] error - test service`);
  });
  afterEach(function () {
   sinon.restore();
  });
 });

 describe("test for  successful response processes", function () {
  it("returns corrected object response", function () {
   const response = processResponse(200, "test service");

   chai.expect(response).property("success").to.be.true;
   chai.expect(response).property("statusCode").to.be.eql(200);
  });
 });
 afterEach(function () {
  sinon.restore();
 });
});
