import {
	InternalServerErrorException, RequestTimeoutException, NotFoundException, Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TimeoutError } from "rxjs";
import { Pagination, PaginationResponseDto, PaginationRequest } from "../../common";
import {
	PermissionMapper, CreatePermissionRequestDto, UpdatePermissionRequestDto, PermissionResponseDto,
} from "./_types";
import { PermissionsRepository } from "./permissions.repository";

@Injectable()
export class PermissionsService {
	constructor(
		@InjectRepository(PermissionsRepository)
		private permissionsRepository: PermissionsRepository,
	) { }

	/**
	 * Get a paginated permission list
	 * @param pagination {PaginationRequest}
	 * @returns {Promise<PaginationResponseDto<PermissionResponseDto>>}
	 */
	public async getPermissions(pagination: PaginationRequest): Promise<PaginationResponseDto<PermissionResponseDto>> {
		try {
			const [permissionEntities, totalPermissions] = await this.permissionsRepository.getPermissionsAndCount(
				pagination,
			);

			const permissionDtos = await Promise.all(permissionEntities.map(PermissionMapper.toDto));
			return Pagination.of(pagination, totalPermissions, permissionDtos);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new NotFoundException();
			}
			if (error instanceof TimeoutError) {
				throw new RequestTimeoutException();
			} else {
				throw new InternalServerErrorException();
			}
		}
	}

	/**
	 * Get permission by id
	 * @param id {number}
	 * @returns {Promise<PermissionResponseDto>}
	 */
	public async getPermissionById(id: number): Promise<PermissionResponseDto> {
		const permissionEntity = await this.permissionsRepository.findOne({ where: { id } });
		if (!permissionEntity) {
			throw new NotFoundException();
		}

		return PermissionMapper.toDto(permissionEntity);
	}

	/**
	 * Create new permission
	 * @param permissionDto {CreatePermissionRequestDto}
	 * @returns {Promise<PermissionResponseDto>}
	 */
	public async createPermission(permissionDto: CreatePermissionRequestDto): Promise<PermissionResponseDto> {
		let permissionEntity = PermissionMapper.toCreateEntity(permissionDto);
		permissionEntity = await this.permissionsRepository.save(permissionEntity);
		return PermissionMapper.toDto(permissionEntity);
	}

	/**
	 * Update permission by id
	 * @param id {number}
	 * @param permissionDto {UpdatePermissionRequestDto}
	 * @returns {Promise<PermissionResponseDto>}
	 */
	public async updatePermission(id: number, permissionDto: Partial<UpdatePermissionRequestDto>):
		Promise<PermissionResponseDto> {
		let permissionEntity = await this.permissionsRepository.findOne({ where: { id } });
		if (!permissionEntity) {
			throw new NotFoundException(`Permission with id=${id} cannot be found`);
		}

		permissionEntity = PermissionMapper.toUpdateEntity(permissionEntity, permissionDto);
		permissionEntity = await this.permissionsRepository.save(permissionEntity);
		return PermissionMapper.toDto(permissionEntity);
	}
}
