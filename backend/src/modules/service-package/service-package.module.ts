import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePackageService } from './service-package.service';
import { ServicePackageController } from './service-package.controller';
import { ServicePackage } from './entities/service-package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServicePackage])],
  controllers: [ServicePackageController],
  providers: [ServicePackageService],
  exports: [ServicePackageService],
})
export class ServicePackageModule {}
