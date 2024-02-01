import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SftpClient from 'ssh2-sftp-client';

@Injectable()
export class ReleasesService {
  private readonly client: SftpClient;
  constructor(private readonly configService: ConfigService) {
    this.client = new SftpClient();
  }

  async getFile(channel: string, filename: string): Promise<any> {
    console.log('filename', filename);
    console.log({ channel });
    await this.client.connect({
      host: this.configService.getOrThrow('SFTP_HOST'),
      port: this.configService.getOrThrow('SFTP_PORT'),
      username: this.configService.getOrThrow('SFTP_USERNAME'),
      password: this.configService.getOrThrow('SFTP_PASSWORD'),
    });

    const list = await this.client.list(
      `${this.configService.getOrThrow('SFTP_REMOTE_PATH')}/${channel}`,
    );
    if (list.find((file) => file.name === filename)) {
      const stream = await this.client.get(
        `${this.configService.getOrThrow(
          'SFTP_REMOTE_PATH',
        )}/${channel}/${filename}`,
      );
      await this.client.end();
      return new StreamableFile(stream as Uint8Array);
    }
    await this.client.end();
    throw new NotFoundException();
  }
}
