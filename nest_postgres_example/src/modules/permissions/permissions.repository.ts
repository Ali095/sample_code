import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PaginationRequest } from "../../common";
import { PermissionEntity } from "./permission.entity";

@Injectable()
export class PermissionsRepository extends Repository<PermissionEntity> {
  constructor(private dataSource: DataSource) {
    super(PermissionEntity, dataSource.createEntityManager());
  }

  /**
   * Get permision list
   * @param pagination {PaginationRequest}
   * @returns permissionEntities[] and totalPermissions
   */
  public async getPermissionsAndCount(pagination: PaginationRequest):
    Promise<[permissionEntities: PermissionEntity[], totalPermissions: number]> {
    const {
      skip, limit: take, order, params: { search },
    } = pagination;
    const query = this.createQueryBuilder().skip(skip).take(take).orderBy(order);

    if (search) {
      query.where("description ILIKE :search", {
        search: `%${search}%`,
      });
    }

    return query.getManyAndCount();
  }
}
