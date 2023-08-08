import {
  Body,
  Controller,
  // FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReleaseDto } from './release.dto';

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releaseService: ReleasesService) {}

  @Get(':version')
  healthCheck(@Param('version') version: string) {
    return this.releaseService.getLastRelease(version);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadVersion(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          //new FileTypeValidator({ fileType: 'application/x-msdos-program' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createReleaseDto: CreateReleaseDto,
  ) {
    createReleaseDto.filename = file.originalname;
    await this.releaseService.uploadRelease(createReleaseDto, file.buffer);
  }
}
