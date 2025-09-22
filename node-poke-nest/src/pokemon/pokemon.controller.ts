import { Controller, Get, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { GetByNameDto } from './dto/get-by-name.dto';
import { ListDto } from './dto/list.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly service: PokemonService) {}

  @Get()
  @ApiOkResponse({ description: 'Get a Pokemon by name' })
  async getByName(@Query() dto: GetByNameDto) {
    // dto.name validated
    return this.service.getByName(dto.name);
  }

  @Get('list')
  @ApiOkResponse({ description: 'List pokemons with pagination' })
  async list(@Query() dto: ListDto) {
    return this.service.list(dto.limit, dto.offset);
  }
}
