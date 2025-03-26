import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FindOptions, FindOptionsWhere } from 'typeorm';
import { Client } from './entities/client.entity';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum.ts';
import { ActiveUser } from '../iam/decorators/active.user.decorators';
import { IActiveUser } from '../iam/interfaces/active-user-data.interface';

@Controller('user')
export class ClientController {
  constructor(private readonly userService: ClientService) {}

  @Post()
  create(@Body() createUserDto: CreateClientDto) {
    console.log(
      `STEP-1 : Controller received request with object !${JSON.stringify(createUserDto)}`,
    );
    return this.userService.saveToDatabase(createUserDto);
  }

  @Get('users')
  getAllUser(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query() query: Record<string, unknown>,
  ) {
    const { page: _, limit: __, ...filters } = query;
    return this.userService.getAllUsers(
      page,
      limit,
      filters as FindOptionsWhere<Client>,
    );
  }

  @Get(':id')
  findEntityById(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: IActiveUser,
  ) {
    console.log(`Incomming request with ${id} type of ${typeof id}`, user);
    // return this.userService.findOneById(id);
    return 'success find';
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateClientDto,
  ) {
    return this.userService.updateEntity(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteEntity(id);
  }
}
