import { UniversityAdapter } from "../adapters/universityAdapter";
import { fetchData } from "../services/fetchData";
import { S3Service } from "../services/s3Service";

const bucketName = process.env.BUCKET_NAME!;
const s3Service = new S3Service(bucketName);

const COUNTRIES = ["Canada", "United States", "Spain", "Costa Rica"];

export const handler = async (): Promise<void> => {
  console.log("ETL job running at midnight UTC");
  
  for( const country of COUNTRIES) {
    try {
      console.debug(`Getting data for country ${country}`)
      const rawData = await fetchData(country);
      if (!rawData || rawData.length === 0) {
        console.warn(`No data fetched for country: ${country}`);
        return;
      }
      const transformedData = rawData?.map(UniversityAdapter.transform)
      console.debug('Data transformed correctly');
      const fileName = `${country}.csv`;
      await s3Service.uploadCsv(fileName, transformedData);
      console.debug(`File ${fileName} stored correctly to S3 bucket`);
    } catch (error: any) {
      console.error("Error during ETL process: ", error.message, country);
      // Here we are not throwing the error anymore, we want to keep with the list of countries.
    }
  }
};