import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { configureSwaggerDocs } from './helpers/configure-swagger-docs.helper';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { initializeDataSource } from './database/datasource';
import { DataSource } from 'typeorm';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });

  const logger = app.get(Logger);

  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix('api');
  app.use(helmet());

  app.use(
    bodyParser.json({
      limit: '1.5mb',
      verify: (req, res, buf) => {
        (req as any).rawBody = buf.toString();
      },
    }),
  );

  app.get(DataSource);

  try {
    await initializeDataSource();
    console.log('✅ Data Source has been initialized!');
  } catch (err) {
    console.error('❌ Error during Data Source initialization', err);
    process.exit(1);
  }

  configureSwaggerDocs(app, configService);

  app.enableCors({
    origin: configService.get<string>('ENDPOINT_CORS'),
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  const port = app.get<ConfigService>(ConfigService).get<number>('server.port');
  console.log(`🚀 Listening on port http://localhost:${port}`);
  await app.listen(port);

  logger.log({
    message: 'server started 🚀',
    port,
    url: `http://localhost:${port}/api/v1`,
  });
}
bootstrap();
