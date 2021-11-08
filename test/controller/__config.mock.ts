import Sequelize, { Op, Sequelize as Seq } from "sequelize";
import Sinon from "sinon";
import sinon from "sinon";
import { findAttributes, options } from "../../types";

// eslint-disable-next-line @typescript-eslint/ban-types
async function create(body, model?: Sequelize.ModelCtor<Sequelize.Model>): Promise<Record<string, unknown> | object> {
 return sinon.fake.returns({ id: 1 });
}

async function createMany(body, model?: Sequelize.ModelCtor<Sequelize.Model>): Promise<Sequelize.Model[]> {
 return await model.bulkCreate([...body]);
}

async function findOne(
 attributes: Record<string, Array<string>>,
 options?: options,
 model?: Sequelize.ModelCtor<Sequelize.Model>
): Promise<Sequelize.Model> {
 const returnValue: Partial<Sequelize.Model> = {
  toJSON: Sinon.stub().callsFake(() => ({ id: options.params.id || options.query.id || options.id })),
 };
 if (["1", "2", "3"].includes(options.params.id)) {
  return returnValue as Sequelize.Model;
 }

 return null;
}

async function findAll(
 attributes: findAttributes,
 options?: options,
 model?: Sequelize.ModelCtor<Sequelize.Model>
): Promise<Sequelize.Model[]> {
 const firstValue: Partial<Sequelize.Model> = {
  toJSON: Sinon.stub().callsFake(() => ({ id: 1 })),
 };

 const secondValue: Partial<Sequelize.Model> = {
  toJSON: Sinon.stub().callsFake(() => ({ id: 2 })),
 };

 const thirdValue: Partial<Sequelize.Model> = {
  toJSON: Sinon.stub().callsFake(() => ({ id: 3 })),
 };
 const returnValue: Partial<Sequelize.Model[]> = [
  firstValue as Sequelize.Model,
  secondValue as Sequelize.Model,
  thirdValue as Sequelize.Model,
 ];

 return returnValue as Sequelize.Model[];
}

async function count(options, model?: Sequelize.ModelCtor<Sequelize.Model>): Promise<number> {
 if (options.firstName == "Stanley" || ["1", "2", "3"].includes(options?.params?.id)) return 1;

 return 0;
}

async function update(
 updateData: Record<string, any>,
 updateOptions: options,
 model?: Sequelize.ModelCtor<Sequelize.Model>
): Promise<[number, Sequelize.Model[]]> {
 return [1, []];
}

async function hardDelete(
 attributes: Record<string, Array<string>>,
 options?: options,
 model?: Sequelize.ModelCtor<Sequelize.Model>
): Promise<number> {
 return 1;
}

async function softDelete(
 attributes: Record<string, Array<string>>,
 options?: options,
 model?: Sequelize.ModelCtor<Sequelize.Model>
): Promise<[number, Sequelize.Model[]]> {
 return [1, []];
}
export { create, findOne, findAll, count, update, softDelete, hardDelete };
