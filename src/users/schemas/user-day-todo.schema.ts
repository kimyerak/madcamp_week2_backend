import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Todo {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  complete: boolean;

  date?: Date; // 추가된 필드
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

@Schema()
export class UserDayTodo extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: [TodoSchema], required: true })
  todos: Todo[];
}

export const UserDayTodoSchema = SchemaFactory.createForClass(UserDayTodo);
export type UserDayTodoDocument = UserDayTodo & Document;
export type TodoDocument = Todo & Document;