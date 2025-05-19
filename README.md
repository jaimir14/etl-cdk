# ETL CDK Project

This project is an AWS CDK stack written in TypeScript that deploys a scheduled **ETL process** using AWS Lambda, Amazon EventBridge, and S3. It also provides an API endpoint to download the generated CSV files.

---

## 📦 Project Structure

- **Lambda (ETL job)**: Extracts data from an external API, transforms it, validates the schema, and stores the result as a CSV in an S3 bucket.
- **EventBridge Rule**: Triggers the ETL Lambda every day at **00:00 UTC**.
- **S3 Bucket**: Stores the CSV output files.
- **API Gateway + Lambda**: Allows users to download the selected CSV file.

---

## ⚙️ ETL Process Details

The ETL Lambda function performs the following steps:

1. **Data Extraction**: Fetches data from an external API.
2. **Data Transformation**: Processes and formats the data as needed.
3. **Data Validation**: Ensures the data conforms to the expected schema.
4. **Data Cleaning**: Removes any comma characters from the data to prevent issues with CSV parsing.
5. **CSV Generation**: Converts the cleaned data into CSV format.
6. **Data Storage**: Uploads the CSV file to the designated S3 bucket.

This process is scheduled to run automatically every day at **00:00 UTC** using Amazon EventBridge.

---

## 🌐 API Endpoint for CSV Download

An API Gateway is configured to provide access to the generated CSV files.

- **Endpoint**: `GET /etl`
- **Query Parameter**: `country` (e.g., `?country=Canada`)
- **Functionality**: Retrieves the corresponding CSV file from the S3 bucket and returns it as a downloadable file.

## 🚀 Deployment Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Build the project

```bash
npm run build
```

### 3. Deploy the stack

```bash
cdk deploy
```

This will provision:

- An S3 Bucket
- ETL Lambda
- Event bridge ( runnint daily at 00:00 UTC)
- An API Gateway to manage CSV downloads

---

## Future improvements

### 🔄 Efficient Update Strategy with Checksums

To optimize the ETL process and avoid unnecessary data processing, implement a checksum-based validation mechanism:

- **Checksum Validation**: Compute a checksum (e.g., SHA-256) for the fetched data and compare it against the previously stored checksum. If the checksums match, the data hasn't changed, and the ETL process can be skipped.

- **Source Update Verification**: If the source API provides metadata about the last update time, use this information to determine whether to proceed with the ETL process. It can even synchronized with the update time of the source to make it hourly, daily or weekly.

---

### 📬 Scaling ETL Processing with Amazon SQS

To handle increased data volume and improve fault tolerance, I consider that integrating Amazon Simple Queue Service (SQS) in the architecture would be a good option:

- **Parallel Processing**:Breaking down the ETL tasks into smaller units (e.g., per country) and enqueue them in SQS. Multiple Lambda functions can then process these messages concurrently, enabling parallel data processing.

- **Error Handling and Retries**: Configuring Dead Letter Queues (DLQs) for messages that fail processing after a specified number of attempts. This ensures that problematic data doesn't block the processing pipeline and can be reviewed or retried later.

- **Scalability**: SQS decouples the data ingestion layer from the processing layer, allowing each to scale independently based on demand, for instance if it is required in the future to add more filters not just country, or if it would be also an option to add more data besides universities.

---
