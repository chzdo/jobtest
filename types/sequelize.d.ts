import { Model } from "sequelize";

interface starwarsModelInstance extends Model {
 id: number;
 ip: string;
 movieId: number;
 comment: string;
 createdDate: Date;
 isDeleted: boolean;
}
export { starwarsModelInstance };
