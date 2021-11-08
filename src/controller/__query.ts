import Sequelize, { Op, Sequelize as Seq } from "sequelize";
import { inspect } from "util";
import { findAttributes, options } from "../../types";

/**
 *
 * @param attributes
 * @param options
 * @param aggregateOptions
 * @param pagination
 * @returns {Sequelize.FindOptions}
 */

function processQueryOptions(options?: options): Sequelize.FindOptions {
 const { project, sort, group, page, population } = options.query;

 const start = page && population ? (parseInt(page) - 1) * parseInt(population) : 0;
 const attributes = project ? project.split(",") : undefined;
 const orderOptions = sort ? sort.split(",").map((value) => value.split(":")) : [];
 const limit = population ? parseInt(population) : undefined;

 if (options.query) {
  delete options.query.project;
  delete options.query.sort;
  delete options.query.group;
  delete options.query.page;
  delete options.query.population;
 }
 const processedOptions: Record<symbol | string, any> = options ? processQuery(options) : {};

 return {
  attributes,
  where: {
   ...processedOptions,
  },
  offset: start,
  limit,
  order: [...orderOptions],
  group,
 };
}

function processUpdateOptions(options?: options): Sequelize.UpdateOptions {
 const processedOptions: Record<symbol | string, any> = options ? processQuery(options) : {};

 return {
  where: {
   ...processedOptions,
  },
 };
}

function processCountQueryOptions(options: options): Sequelize.FindAndCountOptions {
 const processedOptions: Record<symbol | string, any> = options ? processQuery(options) : {};

 return {
  where: {
   ...processedOptions,
  },
 };
}

function processQuery(options: options) {
 const { params, query, ...rest } = options;
 const queryBuilder = [];

 if (params) Object.keys(params).length > 0 && queryBuilder.push(params);
 if (rest) Object.keys(rest).length > 0 && queryBuilder.push(rest);

 if (query) {
  for (const queries in query) {
   if (typeof query[queries] === "string") {
    if (query[queries].includes(",")) {
     queryBuilder.push(buildOr(query[queries], queries));
    } else if (query[queries].includes("!")) {
     queryBuilder.push(buildNot(query[queries], queries));
    } else if (query[queries].includes(":")) {
     queryBuilder.push(buildIn(query[queries], queries));
    } else if (query[queries].includes("~")) {
     queryBuilder.push(buildRange(query[queries], queries));
    } else if (query[queries].includes("%")) {
     queryBuilder.push(buildLike(query[queries], queries));
    } else {
     queryBuilder.push({ [queries]: query[queries] });
    }
   }
  }
 }

 return {
  [Op.and]: [...queryBuilder, { isDeleted: false }],
 };
}

function loadQuery(queryBuilder: Array<any>, query?: Array<any> | Record<any, any>): Array<any> {
 const key = Reflect.ownKeys(query)[0];
 const actualQueries = Array.isArray(query[key]) ? query[key] : Array.isArray(query) ? query : [query];

 for (const actualQuery of actualQueries) {
  const field = Reflect.ownKeys(actualQuery)[0];
  const operator = Reflect.ownKeys(actualQuery[field])[0];

  const queryIndex = queryBuilder.findIndex((value) => (value[field][operator] ? true : false));

  if (queryIndex >= 0 && Array.isArray(queryBuilder[queryIndex][field][operator])) {
   queryBuilder[queryIndex][field][operator].push(...actualQuery[field][operator]);
  } else {
   queryBuilder.push(actualQuery);
  }
 }

 return queryBuilder;
}

function buildOr(value, key): Record<symbol | string, any> {
 let orQueryBuilder = [];
 const orValuesArray = value.split(",");

 for (const orFields of orValuesArray) {
  if (orFields.includes("!")) {
   orQueryBuilder = loadQuery(orQueryBuilder, buildNot(orFields, key));
  } else if (orFields.includes("~")) {
   orQueryBuilder = loadQuery(orQueryBuilder, buildRange(orFields, key));
  } else if (orFields.includes("%")) {
   orQueryBuilder = loadQuery(orQueryBuilder, buildLike(orFields, key));
  } else {
   const temp = orFields.split(":");
   orFields.includes(":") && temp.shift();
   orQueryBuilder = loadQuery(orQueryBuilder, {
    [key]: {
     [Op.in]: temp,
    },
   });
  }
 }
 return orQueryBuilder.length === 0
  ? {}
  : {
     [Op.or]: orQueryBuilder,
    };
}

function buildIn(value, key) {
 const inQuery = [];
 const valueArray = value.split(":");
 !valueArray[0] && valueArray.shift();
 inQuery.push({
  [key]: {
   [Op.in]: [...valueArray],
  },
 });

 return inQuery;
}

function buildRange(value, key) {
 const notRangeQuery = value.split("~");
 let notRangeQueryBuilder: any = {};
 if (notRangeQuery[0] && notRangeQuery[1]) {
  notRangeQueryBuilder = Seq.literal(` (${key} >= ${notRangeQuery[0]} and  ${key} <= ${notRangeQuery[1]})`);
 } else if (!notRangeQuery[0]) {
  notRangeQueryBuilder = Seq.literal(` (${key} <= ${notRangeQuery[1]})`);
 } else if (!notRangeQuery[1]) {
  notRangeQueryBuilder = Seq.literal(` ${key} >= ${notRangeQuery[0]}`);
 }

 return {
  [key]: notRangeQueryBuilder,
 };
}

function buildLike(value, key) {
 const likeQuery = [];

 likeQuery.push({
  [key]: {
   [Op.like]: value,
  },
 });

 return likeQuery;
}

function buildNot(value: string, key: string): Record<symbol | string, unknown> {
 let notQueryBuilder = [];
 const valueArray = value.split("!");
 valueArray.shift();
 for (const vrray of valueArray) {
  if (vrray.includes("~")) {
   notQueryBuilder = loadQuery(notQueryBuilder, buildNotRange(vrray, key));
  } else if (vrray.includes("%")) {
   notQueryBuilder = loadQuery(notQueryBuilder, buildNotLike(vrray, key));
  } else {
   notQueryBuilder = loadQuery(notQueryBuilder, {
    [key]: {
     [Op.notIn]: [vrray.split(":").join("")],
    },
   });
  }
 }
 return {
  [Op.or]: notQueryBuilder,
 };
}

function buildNotRange(value, key): Record<symbol | string, unknown> {
 const notRangeQuery = value.split("~");
 let notRangeQueryBuilder: any = {};
 if (notRangeQuery[0] && notRangeQuery[1]) {
  notRangeQueryBuilder = Seq.literal(`not (${key} >= ${notRangeQuery[0]} and  ${key} <= ${notRangeQuery[1]})`);
 } else if (!notRangeQuery[0]) {
  notRangeQueryBuilder = Seq.literal(`not (${key} <= ${notRangeQuery[1]})`);
 } else if (!notRangeQuery[1]) {
  notRangeQueryBuilder = Seq.literal(`not ${key} >= ${notRangeQuery[0]}`);
 }

 return {
  [key]: notRangeQueryBuilder,
 };
}
function buildNotLike(value, key): Record<symbol | string, unknown> {
 return {
  [key]: {
   [Op.notLike]: value,
  },
 };
}

export { processQueryOptions, processCountQueryOptions, processUpdateOptions };
