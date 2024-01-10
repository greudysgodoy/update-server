import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SftpClient from 'ssh2-sftp-client';

@Injectable()
export class ReleasesService {
  private readonly client: SftpClient;
  constructor(private readonly configService: ConfigService) {
    this.client = new SftpClient();
  }

  async getFile(filename: string): Promise<any> {
    console.log('filename', filename);
    await this.client.connect({
      host: this.configService.getOrThrow('SFTP_HOST'),
      port: this.configService.getOrThrow('SFTP_PORT'),
      username: this.configService.getOrThrow('SFTP_USERNAME'),
      password: this.configService.getOrThrow('SFTP_PASSWORD'),
    });

    const list = await this.client.list('/uploads');
    if (list.find((file) => file.name === filename)) {
      const stream = await this.client.get(`/uploads/${filename}`);
      this.client.end();
      return new StreamableFile(stream as Uint8Array);
    }
    this.client.end();
    throw new NotFoundException();
  }
}
