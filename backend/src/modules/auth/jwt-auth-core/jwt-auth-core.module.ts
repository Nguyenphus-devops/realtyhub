import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/modules/auth/auth-local/guards/jwt-auth.guard';
import { AllConfigType } from 'src/config/config.type';
import { UsersModule } from 'src/modules/auth/users/users.module';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        secret: configService.getOrThrow('auth.secret', { infer: true }),
        signOptions: {
          expiresIn: configService.getOrThrow('auth.expires', {
            infer: true,
          }),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard, UsersModule],
})
export class JwtAuthCoreModule {}
