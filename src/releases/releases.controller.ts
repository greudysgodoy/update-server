import {
  Body,
  Controller,
  // FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReleaseDto } from './release.dto';

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releaseService: ReleasesService) {}

  @Get('latest:version')
  latest(@Param('version') version: string) {
    return this.releaseService.getLastRelease(version);
  }

  @Get(':filename')
  async getFile(@Param('filename') filename: string): Promise<StreamableFile> {
    const streamableFile = await this.releaseService.getFile(filename);
    return streamableFile;
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
