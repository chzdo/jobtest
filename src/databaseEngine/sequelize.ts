import mysql from "mysql2/promise";
import { logger } from "../../utils/winston";
//import "index.ts";
import * as Sequel from "sequelize";
import { Sequelize } from "sequelize";

const { SQ_DB, SQ_USER, SQ_PASSWORD, SQ_HOST } = process.env;

function init(asyncFunctions) {
 return asyncFunctions.reduce(function (chainedFunction, nextFunction) {
  return chainedFunction.then((previousResult) => nextFunction(previousResult));
 }, Promise.resolve());
}

const sequelize = new Sequelize(SQ_DB, SQ_USER, SQ_PASSWORD, {
 host: SQ_HOST,
 dialect: "mysql",
 define: {
  freezeTableName: true,
 },
});

async function initMysql() {
 // eslint-disable-next-line no-async-promise-executor
 return new Promise(async (resolve, reject) => {
  const dbConnection = await mysql.createConnection({
   host: SQ_HOST,
   user: SQ_USER,
   password: SQ_PASSWORD,
  });

  await dbConnection.query("CREATE DATABASE IF NOT EXISTS " + SQ_DB + ";");

  resolve("mysql init successfully");
 });
}

function initSequelize() {
 return new Promise((resolve, reject) => {
  sequelize
   .authenticate()
   .then((e) => {
    logger.info("[sequelize database connected]");
    resolve("");
   })
   .catch((e) => logger.error("[sequelize database connection failed] " + e.message));
 });
}
init([initMysql, initSequelize]);

export default sequelize;
