// import chai from "chai";
// import { processCountQueryOptions, processQueryOptions, processUpdateOptions } from "../../src/controller/__query";
// import { Op } from "sequelize";
// import { inspect } from "util";

// describe("test for query processes", function () {
//  describe("test process query Options", function () {
//   it("should return Sequelize find options ", function () {
//    const attributes = {};
//    const options = {};
//    const response = processQueryOptions(options);
//    chai.expect(response).to.have.keys("attributes", "where", "offset", "limit", "order", "group");
//   });

//   it("sould return include as an empty if include is not set in attribute ", function () {
//    const attributes = { exclude: [] };
//    const options = {};
//    const response = processQueryOptions(options);
//    chai.expect(response.attributes).exist.and.has.ownProperty("include").to.have.lengthOf(0);
//   });
//   it("sould return exclude as an empty if exclude is not set in attribute ", function () {
//    const attributes = { include: [] };
//    const options = {};
//    const response = processQueryOptions(options);
//    chai.expect(response.attributes).exist.and.has.ownProperty("exclude").to.have.lengthOf(1).contains("isDeleted");
//   });
//   it("sould have symbol Op.and at the top most level of the where key", function () {
//    const attributes = { include: [] };
//    const options = {};
//    const response = processQueryOptions(options);
//    chai.expect(response.where).exist.and.has.ownProperty(Op.and);
//   });
//   it("should return the appropriate value if params are passed as argument", function () {
//    const attributes = { include: [] };
//    const options = { params: { id: 1, role: 2 } };
//    const response = processQueryOptions(options);

//    const expectedResponse = [
//     {},
//     {
//      [Op.and]: [
//       {
//        id: 1,
//       },
//       {
//        role: 2,
//       },
//      ],
//     },
//     {
//      isDeleted: false,
//     },
//    ];
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where[Op.and], { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });
//   it("should return the appropriate value if query  are passed as argument", function () {
//    const attributes = { include: [] };
//    const options = { query: { id: "1", role: "2" } };
//    const response = processQueryOptions(options);

//    const expectedResponse = {
//     [Op.and]: [
//      {},

//      {
//       id: "1",
//      },
//      {
//       role: "2",
//      },

//      {
//       isDeleted: false,
//      },
//     ],
//    };
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });

//   it("should return the appropriate value if order are passed as argument", function () {
//    const attributes = { include: [] };
//    const options = { query: { id: "1", role: "2" } };
//    const response = processQueryOptions(options);

//    const expectedResponse = ["id"];
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.order, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });

//   it("should return the appropriate value if group Options are passed as argument", function () {
//    const attributes = { include: [] };
//    const options = { query: { id: "1", role: "2" } };
//    const response = processQueryOptions(options);

//    const expectedResponse = "role";
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.group, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });

//   it("should return the appropriate value if pagination are passed as argument", function () {
//    const attributes = { include: [] };
//    const options = { query: { id: "1", role: "2" } };
//    const response = processQueryOptions(options);

//    const expectedResponse = 40;
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.offset, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });

//   it("should return the appropriate value if query  are passed as argument and it is not a string", function () {
//    const attributes = { include: [] };
//    const options = { query: { id: 1, role: 2 } };
//    const response = processQueryOptions(options);

//    const expectedResponse = {
//     [Op.and]: [
//      {},

//      {
//       isDeleted: false,
//      },
//     ],
//    };
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });

//   it("should return the appropriate value if query with , seperator are passed as argument", function () {
//    const attributes = { include: [] };
//    const options = { query: { id: "1,2,3,!4,:5,6~7,%23" } };
//    const response = processQueryOptions(options);

//    const expectedResponse = {
//     [Op.and]: [
//      {},
//      [
//       {
//        [Op.or]: [
//         {
//          id: "1",
//         },
//         {
//          id: "2",
//         },
//         {
//          id: "3",
//         },
//         [
//          {
//           id: {
//            [Op.notIn]: ["4"],
//           },
//          },
//         ],
//         [
//          {
//           id: {
//            [Op.in]: ["5"],
//           },
//          },
//         ],
//         [
//          {
//           id: {
//            [Op.between]: ["6", "7"],
//           },
//          },
//         ],
//         [
//          {
//           id: {
//            [Op.like]: "%23",
//           },
//          },
//         ],
//        ],
//       },
//      ],
//      {
//       isDeleted: false,
//      },
//     ],
//    };
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });

//   it("should return the appropriate value if query with ! seperator are passed as argument", function () {
//    const attributes = { include: [] };
//    const options = { query: { id: "!6~7!:3!%56" } };
//    const response = processQueryOptions(options);

//    const expectedResponse = {
//     [Op.and]: [
//      {},
//      [
//       {
//        id: {
//         [Op.notBetween]: ["6", "7"],
//        },
//       },
//       {
//        id: { [Op.notIn]: ["3"] },
//       },
//       { id: { [Op.notLike]: "%56" } },
//      ],
//      {
//       isDeleted: false,
//      },
//     ],
//    };
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });

//   it("should return the appropriate value if query with : seperator are passed as argument", function () {
//    const attributes = { include: [] };
//    const options = { query: { id: ":4:6:5" } };
//    const response = processQueryOptions(options);

//    const expectedResponse = {
//     [Op.and]: [
//      {},
//      [
//       {
//        id: {
//         [Op.in]: ["4", "6", "5"],
//        },
//       },
//      ],
//      {
//       isDeleted: false,
//      },
//     ],
//    };
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });
//   it("should return the appropriate value if query with ~ seperator are passed as argument", function () {
//    const attributes = { include: [] };
//    const options = { query: { id: "4~5" } };
//    const response = processQueryOptions(options);

//    const expectedResponse = {
//     [Op.and]: [
//      {},
//      [
//       {
//        id: {
//         [Op.between]: ["4", "5"],
//        },
//       },
//      ],
//      {
//       isDeleted: false,
//      },
//     ],
//    };
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });

//   it("should return the appropriate value if query with % seperator are passed as argument", function () {
//    const attributes = { include: [] };
//    const options = { query: { id: "%5" } };
//    const response = processQueryOptions(options);

//    const expectedResponse = {
//     [Op.and]: [
//      {},
//      [
//       {
//        id: {
//         [Op.like]: "%5",
//        },
//       },
//      ],
//      {
//       isDeleted: false,
//      },
//     ],
//    };
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });

//   it("should return empty object if options is undefined", function () {
//    const attributes = { include: [] };
//    const options = undefined;
//    const response = processQueryOptions(options);

//    const expectedResponse = {};
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });
//  });

//  describe("test process query update Options", function () {
//   it("should return the appropriate value if query  are passed as argument", function () {
//    const options = { query: { id: "1", role: "2" } };
//    const response = processUpdateOptions(options);
//    const expectedResponse = {
//     [Op.and]: [
//      {},

//      {
//       id: "1",
//      },
//      {
//       role: "2",
//      },

//      {
//       isDeleted: false,
//      },
//     ],
//    };
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });

//   it("should return empty object if options is undefined", function () {
//    const options = undefined;
//    const response = processUpdateOptions(options);

//    const expectedResponse = {};
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });
//  });

//  describe("test process query count Options", function () {
//   it("should return the appropriate value if query  are passed as argument", function () {
//    const options = { query: { id: "1", role: "2" } };
//    const response = processCountQueryOptions(options);
//    const expectedResponse = {
//     [Op.and]: [
//      {},

//      {
//       id: "1",
//      },
//      {
//       role: "2",
//      },

//      {
//       isDeleted: false,
//      },
//     ],
//    };
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });

//   it("should return empty object if options is undefined", function () {
//    const options = undefined;
//    const response = processCountQueryOptions(options);
//    const expectedResponse = {};
//    const serialExpectedResponse = inspect(expectedResponse, { depth: null });
//    const serialResponse = inspect(response.where, { depth: null });
//    chai.expect(serialResponse).to.deep.equal(serialExpectedResponse);
//   });
//  });
// });
