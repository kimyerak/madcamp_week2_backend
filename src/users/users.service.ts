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

//1. 일별
async getTodosByDate(name: string, date: Date): Promise<Todo[]> {
  const userDayTodo = await this.userDayTodoModel.findOne({ name, date }).exec();
  if (userDayTodo) {
     return userDayTodo.todos.map(todo => ({
            type: todo.type,
                    content: todo.content,
                    complete: todo.complete,
                    date: userDayTodo.date
          }));
        } else {
    return [];
  }
}

async getAllTodos(name: string): Promise<Record<string, Todo[]>> {
    const userDayTodos = await this.userDayTodoModel.find({ name }).exec();
    const todosByDate: Record<string, Todo[]> = {};

    userDayTodos.forEach(userDayTodo => {
      const dateKey = userDayTodo.date.toISOString().split('T')[0]; // 날짜만 문자열로 변환
      todosByDate[dateKey] = userDayTodo.todos;
    });

    return todosByDate;
  }


async updateTodo(name: string, date: Date, content: string, complete: boolean): Promise<void> {
  const userDayTodo = await this.userDayTodoModel.findOne({ name, date }).exec();
  if (userDayTodo) {
    const todo = userDayTodo.todos.find(todo => todo.content === content);
    if (todo) {
      todo.complete = complete;
      await userDayTodo.save();
    } else {
      throw new NotFoundException('Todo not found');
    }
  } else {
    throw new NotFoundException('Todo list not found');
  }
}


//2. 주별
async getTodosByWeek(name: string, startDate: Date, endDate: Date): Promise<Todo[]> {
  const userDayTodos = await this.userDayTodoModel.find({
    name,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).exec();

   const todos = userDayTodos.flatMap(userDayTodo =>
      userDayTodo.todos.map(todo => ({
        type: todo.type,
                content: todo.content,
                complete: todo.complete,
                date: userDayTodo.date
      }))
    );

      return todos;
}

//3. 월별
async getTodosByMonth(name: string, year: number, month: number): Promise<Todo[]> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const userDayTodos = await this.userDayTodoModel.find({
    name,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).exec();

const todos = userDayTodos.flatMap(userDayTodo =>
      userDayTodo.todos.map(todo => ({
        type: todo.type,
                content: todo.content,
                complete: todo.complete,
                date: userDayTodo.date
      }))
    );

  return todos;
}

}
