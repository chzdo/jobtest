import Sequelize, { Op, Sequelize as Seq } from "sequelize";
import { inspect } from "util";
import { findAttributes, options } from "../../types";
import { processQueryOptions, processCountQueryOptions, processUpdateOptions } from "./__query";

// eslint-disable-next-line @typescript-eslint/ban-types
async function create(body, model?: Sequelize.ModelCtor<Sequelize.Model>): Promise<Record<string, unknown> | object> {
 const createResponse = await model.create({ ...body });
 return createResponse.toJSON();
}

async function createMany(body, model?: Sequelize.ModelCtor<Sequelize.Model>): Promise<Sequelize.Model[]> {
 return await model.bulkCreate([...body]);
}

async function findOne(options?: options, model?: Sequelize.ModelCtor<Sequelize.Model>): Promise<Sequelize.Model> {
 const processedOptions = processQueryOptions(options);
 return await model.findOne(processedOptions);
}

async function findAll(options?: options, model?: Sequelize.ModelCtor<Sequelize.Model>): Promise<Sequelize.Model[]> {
 const processedOptions = processQueryOptions(options);
 return await model.findAll(processedOptions);
}

async function count(options, model?: Sequelize.ModelCtor<Sequelize.Model>): Promise<number> {
 const processedOptions = processCountQueryOptions(options);
 return await model.count(processedOptions);
}

async function update(
 updateData: Record<string, any>,
 updateOptions: options,
 model?: Sequelize.ModelCtor<Sequelize.Model>
): Promise<[number, Sequelize.Model[]]> {
 const options = processUpdateOptions(updateOptions);
 return await model.update(updateData, options);
}

async function hardDelete(
 attributes: Record<string, Array<string>>,
 options?: options,
 model?: Sequelize.ModelCtor<Sequelize.Model>
): Promise<number> {
 const processedOptions = processUpdateOptions(options);
 return await model.destroy(processedOptions);
}

async function softDelete(
 attributes: Record<string, Array<string>>,
 options?: options,
 model?: Sequelize.ModelCtor<Sequelize.Model>
): Promise<[number, Sequelize.Model[]]> {
 const processedOptions = processUpdateOptions(options);
 return await model.update({ isDeleted: true }, processedOptions);
}
export { create, findOne, findAll, count, update, softDelete, hardDelete };
