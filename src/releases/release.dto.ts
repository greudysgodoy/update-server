import { ApiProperty } from '@nestjs/swagger';

export class CreateReleaseDto {
  @ApiProperty({ readOnly: true })
  id: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  notes: string;
}

export class ReleaseDto extends CreateReleaseDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  createdDate: Date;

  @ApiProperty()
  updatedDate: Date;
}
