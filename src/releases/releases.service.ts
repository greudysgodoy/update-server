import { Injectable } from '@nestjs/common';
import { CreateReleaseDto, ReleaseDto } from './release.dto';
import { Release } from './release.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class ReleasesService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Release)
    private releaseRepository: Repository<Release>,
  ) {}

  async getLastRelease(version: string): Promise<ReleaseDto> {
    const releases = await this.releaseRepository.find({
      order: { createdDate: 'DESC' },
    });
    const lastRelease = releases[0];
    if (releases && lastRelease && lastRelease.version !== version) {
      const command = new GetObjectCommand({
        Bucket: 'chq-totem-dist',
        Key: lastRelease.filename,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });

      const release = new ReleaseDto();
      release.version = lastRelease.version;
      release.notes = lastRelease.notes;
      release.url = url;
      return release;
    }
  }

  async uploadRelease(release: CreateReleaseDto, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'chq-totem-dist',
        Key: release.filename,
        Body: file,
      }),
    );
    await this.releaseRepository.save(release);
  }
}
