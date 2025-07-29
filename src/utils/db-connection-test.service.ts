import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DBConnectionTestService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      console.log('✅ PostgreSQL DB connection successful');
      await queryRunner.release();
    } catch (error) {
      console.error('❌ Failed to connect to the database', error);
    }
  }
}
