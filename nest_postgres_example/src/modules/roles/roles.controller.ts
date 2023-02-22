import {
  Controller, Param, Body, Get, Post, Put, ParseIntPipe,
} from "@nestjs/common";
import { TOKEN_NAME } from "src/config";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import {
  ApiDocument, PaginationParams, PaginationRequest, PaginationResponseDto,
} from "../../common";
import { UpdateRoleRequestDto, CreateRoleRequestDto, RoleResponseDto } from "./_types";
import { RolesService } from "./roles.service";

@ApiTags("Roles")
@ApiBearerAuth(TOKEN_NAME)
@Controller({
  path: "access/roles",
  version: "1",
})
export class RolesController {
  constructor(private rolesService: RolesService) { }

  @ApiDocument({
    requestDescription: "Fetch the list of roles in system. It required important priviliges otherwise access will be revoked",
    responseDescription: "Paginated list for roles based on criteria",
    pagination: true,
    returnDataDto: RoleResponseDto,
    errorResponses: [404, 401, 403],
  })
  @ApiQuery({
    name: "search", type: "string", required: false, example: "admin",
  })
  @Get()
  public getRoles(@PaginationParams() pagination: PaginationRequest): Promise<PaginationResponseDto<RoleResponseDto>> {
    return this.rolesService.getRoles(pagination);
  }

  @ApiDocument({
    requestDescription: "Fetch the details of specific role using ID of that role. It required important priviliges otherwise access will be revoked",
    responseDescription: "Details of specific role whose id is provided",
    returnDataDto: RoleResponseDto,
    errorResponses: [404, 401, 403],
  })
  @Get("/:id")
  public getRoleById(@Param("id", ParseIntPipe) id: number): Promise<RoleResponseDto> {
    return this.rolesService.getRoleById(id);
  }

  @ApiDocument({
    requestDescription: "Request to create a new role in system. It required important priviliges otherwise access will be revoked",
    responseDescription: "Details of newly created role",
    returnDataDto: RoleResponseDto,
    errorResponses: [409, 401, 403],
  })
  @Post()
  public createRole(@Body() roleDto: CreateRoleRequestDto): Promise<RoleResponseDto> {
    return this.rolesService.createRole(roleDto);
  }

  @ApiDocument({
    requestDescription: "update the details of specific role using ID of that role. It required important priviliges otherwise access will be revoked",
    responseDescription: "Details of updated role",
    returnDataDto: RoleResponseDto,
    errorResponses: [409, 404, 401, 403],
  })
  @Put("/:id")
  public updateRole(@Param("id", ParseIntPipe) id: number, @Body() roleDto: UpdateRoleRequestDto): Promise<RoleResponseDto> {
    return this.rolesService.updateRole(id, roleDto);
  }
}
