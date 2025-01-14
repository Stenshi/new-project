import { Test, TestingModule } from '@nestjs/testing';
import { OperationLogController } from './operation-log.controller';
import { OperationLogService } from './operation-log.service';

describe('OperationLogController', () => {
  let controller: OperationLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationLogController],
      providers: [OperationLogService],
    }).compile();

    controller = module.get<OperationLogController>(OperationLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
