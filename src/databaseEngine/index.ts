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
if (config.use_env_variable) {
 sequelize = new sequelizing(process.env[config.use_env_variable], config);
} else {
 sequelize = new sequelizing(config.database, config.username, config.password, config);
 dbConnection = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password,
 });

 dbConnection.query("CREATE DATABASE IF NOT EXISTS " + config.database + ";");
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

// Object.keys(db).forEach((modelName) => {
//  if (db[modelName].associate) {
//   db[modelName].associate(db);
//  }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
