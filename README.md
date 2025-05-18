# ETL CDK Project

This project is an AWS CDK stack written in TypeScript that deploys a scheduled **ETL process** using AWS Lambda, Amazon EventBridge, and S3. It also provides an API endpoint to download the generated CSV files.

---

## 📦 Project Structure

- **Lambda (ETL job)**: Extracts data from an external API, transforms it, validates the schema, and stores the result as a CSV in an S3 bucket.
- **EventBridge Rule**: Triggers the ETL Lambda every day at **00:00 UTC**.
- **S3 Bucket**: Stores the CSV output files.
- **API Gateway + Lambda**: Allows users to download the selected CSV file.

---

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