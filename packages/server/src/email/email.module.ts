import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [EmailController],
  providers: [EmailService]
})
export class EmailModule {}
