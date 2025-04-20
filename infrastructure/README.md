# Vecino Marketplace Infrastructure

This directory contains the infrastructure as code and CI/CD pipeline configuration for the Vecino Marketplace application.

## Project Structure

- `.github/workflows/` - GitHub Actions workflow files
- `infrastructure/cdk/` - AWS CDK infrastructure code

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

### Lint and Test Workflow (lint-test.yml)

This workflow runs on pull requests to the `main` branch:

1. It spins up services (MongoDB, Redis) required for testing
2. Checks out the code
3. Sets up Node.js environment
4. Installs dependencies
5. Runs linting
6. Executes tests for all workspaces (frontend, backend, shared)

### Build and Deploy Workflow (deploy.yml)

This workflow runs on pushes to the `main` branch:

1. Checks out the code
2. Sets up Node.js environment
3. Installs dependencies
4. Runs linting and tests
5. Builds all packages (shared, frontend, backend)
6. Configures AWS credentials
7. Deploys frontend to S3 and invalidates CloudFront cache
8. Packages and deploys backend to Elastic Beanstalk

## AWS Infrastructure

The AWS infrastructure is defined using AWS CDK in `infrastructure/cdk/app.js`. It creates:

1. **S3 Bucket** - For storing frontend static files
2. **CloudFront Distribution** - For content delivery network (CDN)
3. **Elastic Beanstalk Application** - For hosting the backend
4. **Necessary IAM Roles** - For Elastic Beanstalk and EC2 instances

## Setup Instructions

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Run linting: `npm run lint`
4. Run tests: `npm run test`
5. Start development server: `npm run dev`

### Setting Up AWS Infrastructure

1. Install AWS CDK: `npm install -g aws-cdk`
2. Configure AWS credentials: `aws configure`
3. Navigate to the CDK directory: `cd infrastructure/cdk`
4. Install dependencies: `npm install`
5. Bootstrap the CDK environment: `npm run bootstrap`
6. Deploy the stack: `npm run deploy`

### Required GitHub Secrets

The following secrets must be set in the GitHub repository for CI/CD:

- `AWS_ACCESS_KEY_ID` - AWS access key ID with appropriate permissions
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `S3_BUCKET_NAME` - Name of the S3 bucket for frontend assets
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID
- `EB_APPLICATION_NAME` - Elastic Beanstalk application name
- `EB_ENVIRONMENT_NAME` - Elastic Beanstalk environment name

These values will be available in the AWS Management Console after deploying the CDK stack or from the CDK stack outputs.

## Manual Deployment

If you need to deploy manually:

### Frontend

```bash
npm run build --workspace=frontend
aws s3 sync frontend/dist/ s3://<S3_BUCKET_NAME> --delete
aws cloudfront create-invalidation --distribution-id <CLOUDFRONT_DISTRIBUTION_ID> --paths "/*"
```

### Backend

```bash
npm run build --workspace=shared
npm run build --workspace=backend
# Package the application (similar to GitHub Actions workflow)
# Deploy to Elastic Beanstalk
```
