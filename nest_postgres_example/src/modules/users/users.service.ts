import { NotFoundException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pagination, PaginationRequest, PaginationResponseDto } from "../../common";
import {
  UserMapper,
  CreateUserRequestDto, UpdateUserRequestDto, UserResponseDto,
} from "./_types";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) { }

  /**
   * Get a paginated user list
   * @param pagination {PaginationRequest}
   * @returns {Promise<PaginationResponseDto<UserResponseDto>>}
   */
  public async getUsers(pagination: PaginationRequest): Promise<PaginationResponseDto<UserResponseDto>> {
    const [userEntities, totalUsers] = await this.usersRepository.getUsersAndCount(pagination);

    const UserDtos = await Promise.all(userEntities.map(UserMapper.toDtoWithRelations));
    return Pagination.of(pagination, totalUsers, UserDtos);
  }

  /**
   * Get user by id
   * @param id {string}
   * @returns {Promise<UserResponseDto>}
   */
  public async getUserById(id: number): Promise<UserResponseDto> {
    const userEntity = await this.usersRepository.findOne({ where: { id }, relations: ["permissions", "roles", "userId"] });
    if (!userEntity) {
      throw new NotFoundException();
    }

    return UserMapper.toDtoWithRelations(userEntity);
  }

  /**
   * Create new user
   * @param userDto {CreateUserRequestDto}
   * @returns {Promise<UserResponseDto>}
   */
  public async createUser(id: number, userDto: CreateUserRequestDto): Promise<UserResponseDto> {
    let userEntity = UserMapper.toCreateEntity(id, userDto);
    await this.usersRepository.save(userEntity);
    userEntity = await this.usersRepository.findOne({ where: { id }, relations: ["permissions", "roles"] });
    return UserMapper.toDtoWithRelations(userEntity);
  }

  /**
   * Update User by id
   * @param id {id}
   * @param userDto {UpdateUserRequestDto}
   * @returns {Promise<UserResponseDto>}
   */
  public async updateUser(id: number, userDto: UpdateUserRequestDto): Promise<UserResponseDto> {
    let userEntity = await this.usersRepository.findOne({ where: { id } });
    if (!userEntity) {
      throw new NotFoundException(`User with id=${id} cannot be found in system`);
    }

    userEntity = UserMapper.toUpdateEntity(userEntity, userDto);
    userEntity = await this.usersRepository.save(userEntity);
    return UserMapper.toDtoWithRelations(userEntity);
  }
}
