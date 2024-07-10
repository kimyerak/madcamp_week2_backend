import { Controller, Get, Post, Body, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { UserDayTodo, Todo } from './schemas/user-day-todo.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}



  @Post('signup')
    async signUp(@Body() createUserDto: User) {
      return this.usersService.create(createUserDto);
    }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }
 @Post('todolists')
  @HttpCode(200)
  async addOrUpdateTodo(
    @Body('user_day_todolist') userDayTodolist: UserDayTodo[],
  ): Promise<void> {
    for (const userDayTodo of userDayTodolist) {
      await this.usersService.addOrUpdateTodo(userDayTodo.name, new Date(userDayTodo.date), userDayTodo.todos);
    }
  }

  @Post('todolists/delete')
  @HttpCode(200)
    async deleteTodo(
      @Body('name') name: string,
      @Body('date') date: string,
      @Body('content') content: string,
    ): Promise<void>  {
      const dateObj = new Date(date);
      await this.usersService.deleteTodo(name, dateObj, content);
    }


@Post('todolists/update')
@HttpCode(200)
async updateTodo(
  @Body('name') name: string,
  @Body('date') date: string,
  @Body('content') content: string,
  @Body('complete') complete: boolean,
): Promise<void> {
  const dateObj = new Date(date);
  await this.usersService.updateTodo(name, dateObj, content, complete);
}


@Get('todobydate')
  async getTodosByDate(
    @Query('name') name: string,
    @Query('date') date: string,
  ): Promise<Todo[]> {
    const dateObj = new Date(date);
    return this.usersService.getTodosByDate(name, dateObj);
  }

  @Get('alltodos')
    async getAllTodos(
      @Query('name') name: string,
    ): Promise<Record<string, Todo[]>> {
      return this.usersService.getAllTodos(name);
    }


@Get('todobyweek')
async getTodosByWeek(
  @Query('name') name: string,
  @Query('start_date') startDate: string,
  @Query('end_date') endDate: string,
): Promise<Todo[]> {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  return this.usersService.getTodosByWeek(name, startDateObj, endDateObj);
}
@Get('todobymonth')
async getTodosByMonth(
  @Query('name') name: string,
  @Query('year') year: number,
  @Query('month') month: number,
): Promise<Todo[]> {
  return this.usersService.getTodosByMonth(name, year, month);
}


}
