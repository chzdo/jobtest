import { starwarsModelInstance } from "../../types/sequelize";
import { DataTypes } from "sequelize";
import Sequelize from "sequelize";
import { logger } from "../../utils/winston";

const starwarsSchema = {
 id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
 },
 movieId: {
  type: DataTypes.INTEGER,
 },
 comment: {
  type: DataTypes.STRING,
  validate: {
   max: 500,
  },
  required: true,
  allowNull: false,
 },
 ip: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 createdDate: {
  type: DataTypes.DATE,
  defaultValue: new Date(),
 },

 isDeleted: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
 },
};

export function createModel(sequelize: Sequelize.Sequelize): Sequelize.ModelCtor<starwarsModelInstance> {
 const testModels = sequelize.define<starwarsModelInstance>("comments", starwarsSchema, {
  tableName: "comments",
  freezeTableName: true,
 });
 testModels
  .sync({ alter: true })
  .then((e) => logger.info("[Test Model Sync] Complete"))
  .catch((e) => logger.info("[Test Model Sync] " + e.message));

 return testModels;
}
