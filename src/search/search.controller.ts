import { Controller, Post, Body } from '@nestjs/common';
import { SearchService } from './search.service';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('suggestions')
  @Auth(ValidRoles.user, ValidRoles.admin)
  getSuggestions(@Body('search') search: string) {
    return this.searchService.searchAllEntities(search);
  }
}
