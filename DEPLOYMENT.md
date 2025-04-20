# Vecino Marketplace Deployment Guide

This document provides information on how to deploy the Vecino Marketplace application using CI/CD and AWS services.

## CI/CD Pipeline

The project uses GitHub Actions for CI/CD. The workflow is defined in the `.github/workflows` directory:

- `lint-test.yml`: Runs on pull requests to verify code quality and tests
- `deploy.yml`: Runs on pushes to the main branch to deploy the application

## AWS Deployment

The infrastructure is defined using AWS CDK in the `infrastructure/cdk` directory.

### AWS Services Used

- **Amazon S3**: For hosting frontend static files
- **Amazon CloudFront**: As a content delivery network (CDN) for the frontend
- **AWS Elastic Beanstalk**: For hosting the backend API
- **Amazon RDS**: For the database (optional, can use MongoDB Atlas instead)
- **Amazon ElastiCache**: For Redis caching (optional)

### Prerequisites

1. AWS account
2. AWS CLI installed and configured
3. Appropriate IAM permissions
4. GitHub repository with Actions enabled

### Setup

1. Set up GitHub repository secrets:

   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `S3_BUCKET_NAME`
   - `CLOUDFRONT_DISTRIBUTION_ID`
   - `EB_APPLICATION_NAME`
   - `EB_ENVIRONMENT_NAME`

2. Initialize AWS infrastructure:

   ```bash
   npm run init:aws
   ```

3. Deploy manually (if needed):
   ```bash
   npm run deploy
   ```

## Manual Deployment Steps

If you need to deploy manually without CI/CD:

### Frontend

1. Build the frontend:

   ```bash
   npm run build:frontend
   ```

2. Deploy to S3:
   ```bash
   export S3_BUCKET_NAME=your-bucket-name
   export CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id
   npm run deploy:frontend
   ```

### Backend

1. Build the backend:

   ```bash
   npm run build:shared
   npm run build:backend
   ```

2. Deploy to Elastic Beanstalk:
   ```bash
   cd backend
   eb deploy
   ```

## Monitoring

- Use AWS CloudWatch for logs and metrics
- Set up alarms for critical services
- Monitor application performance using AWS X-Ray

## Rollback

If a deployment fails:

1. For frontend:

   - Revert to a previous version in S3
   - Invalidate CloudFront cache

2. For backend:
   - Use Elastic Beanstalk console to roll back to a previous version
   - Or use CLI: `eb rollback`

## Security Considerations

- All sensitive data should be stored in AWS Secrets Manager or as environment variables
- Use HTTPS for all communications
- Set up appropriate IAM roles with least privilege principle
- Enable AWS CloudTrail for auditing

## Environment Variables

The following environment variables should be set in each environment:

- `NODE_ENV`: `production` for production environment
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection string
- Other application-specific variables as needed

## Further Reading

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html)
- [Elastic Beanstalk Documentation](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html)
- [Amazon S3 Documentation](https://docs.aws.amazon.com/s3/index.html)
- [Amazon CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/index.html)
