import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import { Sequelize as sequelizing } from "sequelize";
import mysql from "mysql2";

const basename = path.basename(__filename);

const env = process.env.NODE_ENV || "development";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(__dirname + "/../../config/config.json")[env];

globalThis.db = {};

let sequelize;

let dbConnection;

const { db_username, db_host, db_password, db_database } = process.env;

if (config.use_env_variable) {
 sequelize = new sequelizing(process.env[config.use_env_variable], {
  ...config,
  ...{ db_username, db_host, db_password, db_database },
 });
} else {
 sequelize = new sequelizing(db_database, db_username, db_password, {
  ...config,
  ...{ username: db_username, host: db_host, password: db_password, database: db_database },
 });

 dbConnection = mysql.createConnection({
  host: db_host,
  user: db_username,
  password: db_password,
 });

 dbConnection.query("CREATE DATABASE IF NOT EXISTS " + db_database + ";");
}

fs
 .readdirSync(__dirname + "/../models")
 .filter((file) => {
  return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts";
 })
 .forEach((file) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createModel } = require(path.join(__dirname, "/../models/" + file));
  const model = createModel(sequelize, Sequelize.DataTypes);
  globalThis.db[model.name] = model;
 });

global.sequelize = sequelize;
