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

## General Instructions
