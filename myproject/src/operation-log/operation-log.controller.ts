import { Controller } from '@nestjs/common';
import { OperationLogService } from './operation-log.service';

@Controller('operation-log')
export class OperationLogController {
  constructor(private readonly operationLogService: OperationLogService) {}
}
