import { ApiProperty } from '@nestjs/swagger';

export class ResponseWrapperDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: any;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  date: Date;
}
