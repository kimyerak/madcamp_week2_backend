import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UserDayTodo, UserDayTodoSchema } from './schemas/user-day-todo.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserDayTodo.name, schema: UserDayTodoSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
