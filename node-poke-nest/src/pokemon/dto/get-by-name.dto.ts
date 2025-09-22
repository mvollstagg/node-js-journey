import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetByNameDto {
  @ApiProperty({ example: 'pikachu' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
