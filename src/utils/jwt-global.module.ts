import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import appConfig from '../helpers/auth.config';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: appConfig().jwtSecret,
      signOptions: { expiresIn: `${appConfig().jwtExpiry}s` },
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobalModule {}
