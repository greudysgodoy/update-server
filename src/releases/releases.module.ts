import { Module } from '@nestjs/common';
import { ReleasesController } from './releases.controller';
import { ReleasesService } from './releases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Release } from './release.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Release])],
  controllers: [ReleasesController],
  providers: [ReleasesService],
})
export class ReleasesModule {}
