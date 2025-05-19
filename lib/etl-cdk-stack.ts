import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';

import path from 'path';
import { Construct } from 'constructs';

export class EtlCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dataBucket = new s3.Bucket(this, 'DataBucket', {
      bucketName: 'etl-transformed-data-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: false,
    });

    const etlFunction = new lambda.Function(this, 'ETLLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'lambdas/etl.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src')),
      timeout: cdk.Duration.seconds(30),
      environment: {
        API_HOST: "http://universities.hipolabs.com/",
        BUCKET_NAME: dataBucket.bucketName,
      }
    });

    const apiFunction = new lambda.Function(this, 'APILambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'lambdas/api.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src')),
      timeout: cdk.Duration.seconds(30),
      environment: {
        BUCKET_NAME: dataBucket.bucketName,
      }
    });
    const api = new apigateway.LambdaRestApi(this, 'ETLApi', {
      handler: apiFunction,
      proxy: false,
      restApiName: 'ETL Service',
      description: 'API Gateway to download files',
    });

    const etlResource = api.root.addResource('etl');
    etlResource.addMethod('GET');


    dataBucket.grantWrite(etlFunction);
    dataBucket.grantRead(apiFunction);

    // EventBridge Rule to run every day at midnight UTC
    const rule = new events.Rule(this, 'DailyETLRule', {
      schedule: events.Schedule.cron({ minute: '0', hour: '0' }), // UTC 00:00
    });

    rule.addTarget(new targets.LambdaFunction(etlFunction));

  }
}
