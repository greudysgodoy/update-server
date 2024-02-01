import {
  Controller,
  // FileTypeValidator,
  Get,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { ReleasesService } from './releases.service';

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releaseService: ReleasesService) {}

  // @Get('latest:version')
  // latest(@Param('version') version: string) {
  //   return this.releaseService.getLastRelease(version);
  // }

  @Get(':channel/:filename')
  async getFile(
    @Param('channel') channel: string,
    @Param('filename') filename: string,
  ): Promise<StreamableFile> {
    const streamableFile = await this.releaseService.getFile(channel, filename);
    return streamableFile;
  }
}
