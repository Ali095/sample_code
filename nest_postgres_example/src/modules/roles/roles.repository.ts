import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PaginationRequest } from "../../common";
import { RoleEntity } from "./role.entity";

@Injectable()
export class RolesRepository extends Repository<RoleEntity> {
  constructor(private dataSource: DataSource) {
    super(RoleEntity, dataSource.createEntityManager());
  }

  /**
   * Get roles list
   * @param pagination {PaginationRequest}
   * @returns [roleEntities: RoleEntity[], totalRoles: number]
   */
  public async getRolesAndCount(pagination: PaginationRequest):
    Promise<[roleEntities: RoleEntity[], totalRoles: number]> {
    const {
      skip, limit: take, order, params: { search },
    } = pagination;
    const query = this.createQueryBuilder("r")
      .innerJoinAndSelect("r.permissions", "p")
      .skip(skip)
      .take(take)
      .orderBy(order);

    if (search) {
      query.where("name ILIKE :search", { search: `%${search}%` });
    }

    return query.getManyAndCount();
  }
}
