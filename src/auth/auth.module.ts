import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtGlobalModule } from 'src/utils/jwt-global.module';

@Module({
  providers: [Repository],
  imports: [TypeOrmModule.forFeature([]), JwtGlobalModule],
  exports: [],
})
export class AuthModule {}
