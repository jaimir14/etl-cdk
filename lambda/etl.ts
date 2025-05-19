import { UniversityAdapter } from "./adapters/universityAdapter";
import { fetchData } from "./services/fetchData";
import { S3Service } from "./services/s3Service";

const bucketName = process.env.BUCKET_NAME!;
const s3Service = new S3Service(bucketName);

export const handler = async (): Promise<void> => {
  console.log("ETL job running at midnight UTC");
  const country = "Canada";

  try {
    const rawData = await fetchData(country);
    if (!rawData || rawData.length === 0) {
      console.warn(`No data fetched for country: ${country}`);
      return;
    }
    const transformedData = rawData?.map(UniversityAdapter.transform)
    
    const fileName = `${country}.csv`;

    await s3Service.uploadCsv(fileName, transformedData);
  } catch (error: any) {
    console.error("Error during ETL process: ", error.message, country);
    throw error;
  }

};