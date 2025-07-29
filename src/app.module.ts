import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import dataSource from './database/datasource';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import serverConfig from './helpers/server.config';
import authConfig from './helpers/auth.config';
import { APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { AppService } from './app.service';
import { DBConnectionTestService } from './utils/db-connection-test.service';

dotenv.config();
const profile = process.env.PROFILE;

@Module({
  imports: [
    // ConfigModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', `.env.${profile}`],
      isGlobal: true,
      load: [serverConfig, authConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .required(),
        PROFILE: Joi.string()
          .valid(
            'local',
            'development',
            'production',
            'ci',
            'testing',
            'staging',
          )
          .required(),
        PORT: Joi.number().required(),
      }),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),

    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get<string>('DB_HOST'),
    //     port: configService.get<number>('DB_PORT'),
    //     username: configService.get<string>('DB_USERNAME'),
    //     password: configService.get<string>('DB_PASSWORD'),
    //     database: configService.get<string>('DB_NAME'),
    //     entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //     synchronize: true, // Set to false in production
    //   }),
    // }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSource.options,
      }),
      dataSourceFactory: async () => dataSource,
    }),
    AuthModule,
    CourseModule,
    LessonModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'CONFIG',
      useClass: ConfigService,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
    },
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    AppService,
    DBConnectionTestService,
  ],
})
export class AppModule {}
