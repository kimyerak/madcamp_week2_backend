import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserDayTodo, UserDayTodoDocument, Todo } from './schemas/user-day-todo.schema';

@Injectable()
export class UsersService {
  constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      @InjectModel(UserDayTodo.name) private readonly userDayTodoModel: Model<UserDayTodoDocument>,) {}

async create(user: User): Promise<User> {
    // 구글 아이디 중복 체크
    const existingUser = await this.userModel.findOne({ id: user.id }).exec();
    if (existingUser) {
      throw new ConflictException('이미 존재하는 구글 아이디입니다.');
    }
    const createdUser = new this.userModel(user);
      return createdUser.save();
    }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findOne({ id }).exec();
  }




//   async addTodo(name: string, date: Date, todo: Todo) {
//     const userDayTodo = await this.userDayTodoModel.findOne({ name, date }).exec();
//     console.log(userDayTodo);
//     if (userDayTodo) {
//       userDayTodo.todos.push({type: todo.type,
//                                 content: todo.content,
//                                 complete: todo.complete,});
//       await userDayTodo.save();
//     } else {
//       const newUserDayTodo = new this.userDayTodoModel({
//         name,
//         date,
//         todos: [todo],
//       });
//       await newUserDayTodo.save();
//     }
//   }
//
//    async createUserDayTodo(userDayTodolist: UserDayTodo[]): Promise<void> {
//         for (const userDayTodo of userDayTodolist) {
//               for (const todo of userDayTodo.todos) {
//                 await this.addTodo(userDayTodo.name, userDayTodo.date, todo);
//               }
//             }
//       }

async addOrUpdateTodo(
    name: string,
    date: Date,
    todos: Todo[],
  ): Promise<void> {
    const userDayTodo = await this.userDayTodoModel.findOne({ name, date }).exec();
    if (userDayTodo) {
      userDayTodo.todos.push(...todos);
      await userDayTodo.save();
    } else {
      const newUserDayTodo = new this.userDayTodoModel({
        name,
        date,
        todos,
      });
      await newUserDayTodo.save();
    }
  }

  async deleteTodo(name: string, date: Date, content: string): Promise<void> {
    const userDayTodo = await this.userDayTodoModel.findOne({ name, date }).exec();
    if (userDayTodo) {
      userDayTodo.todos = userDayTodo.todos.filter(todo => todo.content !== content);
      await userDayTodo.save();
    } else {
      throw new NotFoundException('Todo not found');
    }
  }
async getTodosByDate(name: string, date: Date): Promise<Todo[]> {

  const userDayTodo = await this.userDayTodoModel.findOne({ name, date }).exec();
  if (userDayTodo) {
    return userDayTodo.todos;
  } else {
    return [];
  }
}


}
