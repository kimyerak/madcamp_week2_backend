import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/mydatabase',
    {
              connectionFactory: (connection) => {
//                 Logger.log('Connected to MongoDB');
                connection.on('error', (err) => {
//                   Logger.error('MongoDB connection error:', err);
                });
                connection.on('disconnected', () => {
//                   Logger.warn('MongoDB disconnected');
                });
                return connection;
              },
            }),
    UsersModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
