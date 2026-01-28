import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';

@Module({
  imports: [CommonModule],
  controllers: [DonationsController],
  providers: [DonationsService],
})
export class DonationsModule { }
