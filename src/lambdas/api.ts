import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3Service } from '../services/s3Service';

const bucketName = process.env.BUCKET_NAME!;
const s3Service = new S3Service(bucketName);

export const handler: APIGatewayProxyHandler = async (event) => {
  const country = event.queryStringParameters?.country;

  if (!country) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing "country" query parameter' }),
    };
  }

  const fileName = `${country}.csv`;

  try {
    const bodyContents = await s3Service.getCsv(fileName);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
      body: bodyContents,
    };
  } catch (error: any) {
    if (error.name === 'NoSuchKey') {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `File "${fileName}" not found` }),
      };
    }

    console.error('Error retrieving file from S3:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};