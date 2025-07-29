import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import appConfig from '../helpers/auth.config';
// import appConfig from '../../../config/auth.config';
// import { User } from '../user/entities/user.entity';
// import UserService from '../user/user.service';
// import RegistrationController from './auth.controller';
// import AuthenticationService from './auth.service';
// import { GoogleAuthService } from './google-auth.service';
// import { FacebookStrategy } from './strategies/facebook.strategy';
// import { GoogleStrategy } from './strategies/google.strategy';
// import { EmailService } from '../mailer/mailer.service';
// import { WalletModule } from '../wallet/wallet.module';

@Module({
  // controllers: [RegistrationController],
  providers: [
    // AuthenticationService,
    Repository,
    // UserService,
    // GoogleStrategy,
    // GoogleAuthService,
    // FacebookStrategy,
    // EmailService,
  ],
  imports: [
    TypeOrmModule.forFeature(),
    // TypeOrmModule.forFeature([User]),
    // PassportModule,
    // WalletModule
    JwtModule.register({
      global: true,
      secret: appConfig().jwtSecret,
      signOptions: { expiresIn: `${appConfig().jwtExpiry}s` },
    }),
  ],
  exports: [],
})
export class AuthModule {}
