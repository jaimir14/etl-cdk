import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { jsonToCsv } from '../utils/csvUtils';
import { Readable } from 'stream';

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
   * Gets data as a CSV file from S3.
   * @param key - The S3 object key (e.g., 'Canada.csv').
   */
  async getCsv(key: string): Promise<string> {    
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    // Convert the response body (a stream) to a string
    const streamToString = (stream: Readable): Promise<string> =>
      new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      });

    return await streamToString(response.Body as Readable);
  }
}
