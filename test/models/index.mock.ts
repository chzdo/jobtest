import { Model } from "sequelize";
import { ModelCtor } from "sequelize";

const modelCor: Partial<Model> = {};
export async function sync(): Promise<Model> {
 return new Promise((resolve, reject) => {
  resolve(modelCor as Model);
 });
}

export default modelCor;
