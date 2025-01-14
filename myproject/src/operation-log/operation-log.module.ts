import { Module } from '@nestjs/common';
import { OperationLogService } from './operation-log.service';
import { OperationLogController } from './operation-log.controller';

@Module({
  controllers: [OperationLogController],
  providers: [OperationLogService],
})
export class OperationLogModule {}
