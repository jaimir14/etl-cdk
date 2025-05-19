import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { jsonToCsv } from '../utils/csvUtils';

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(bucketName: string, region: string = 'us-east-1') {
    this.s3Client = new S3Client({ region });
    this.bucketName = bucketName;
  }

  /**
   * Uploads data as a CSV file to S3.
   * @param key - The S3 object key (e.g., 'Canada.csv').
   * @param data - An array of records to be converted to CSV.
   */
  async uploadCsv(key: string, data: Record<string, any>[]): Promise<void> {
    const csvContent = jsonToCsv(data);
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: csvContent,
      ContentType: 'text/csv',
    });

    await this.s3Client.send(command);
  }

  /**
   * Generates a presigned URL for downloading a file from S3.
   * @param key - The S3 object key (e.g., 'Canada.csv').
   * @param expiresIn - URL expiration time in seconds (default: 3600 seconds).
   * @returns A presigned URL string.
   */
  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn });
    return url;
  }
}
