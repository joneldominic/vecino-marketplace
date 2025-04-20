const cdk = require('aws-cdk-lib');
const { Stack, RemovalPolicy } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
const cloudfront = require('aws-cdk-lib/aws-cloudfront');
const origins = require('aws-cdk-lib/aws-cloudfront-origins');
const elasticbeanstalk = require('aws-cdk-lib/aws-elasticbeanstalk');
const iam = require('aws-cdk-lib/aws-iam');

class VecinoMarketplaceStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // S3 bucket for frontend static files
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

    // CloudFront Origin Access Identity
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'CloudFrontOAI', {
      comment: 'OAI for Vecino Marketplace website',
    });

    // Grant CloudFront access to S3 bucket
    websiteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [websiteBucket.arnForObjects('*')],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId,
          ),
        ],
      }),
    );

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'WebsiteDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket, {
          originAccessIdentity: cloudfrontOAI,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enabled: true,
      defaultRootObject: 'index.html',
    });

    // Elastic Beanstalk application
    const ebApplication = new elasticbeanstalk.CfnApplication(this, 'VecinoBackendApp', {
      applicationName: 'vecino-marketplace-backend',
    });

    // IAM role for Elastic Beanstalk
    const ebServiceRole = new iam.Role(this, 'EBServiceRole', {
      assumedBy: new iam.ServicePrincipal('elasticbeanstalk.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSElasticBeanstalkService'),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSElasticBeanstalkEnhancedHealth',
        ),
      ],
    });

    // IAM role for EC2 instances
    const ec2Role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonElastiCacheFullAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    });

    const ec2InstanceProfile = new iam.CfnInstanceProfile(this, 'EC2InstanceProfile', {
      roles: [ec2Role.roleName],
    });

    // Elastic Beanstalk environment
    const ebEnvironment = new elasticbeanstalk.CfnEnvironment(this, 'VecinoBackendEnv', {
      applicationName: ebApplication.applicationName,
      environmentName: 'vecino-marketplace-production',
      solutionStackName: '64bit Amazon Linux 2 v5.8.0 running Node.js 18',
      optionSettings: [
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'IamInstanceProfile',
          value: ec2InstanceProfile.ref,
        },
        {
          namespace: 'aws:elasticbeanstalk:environment',
          optionName: 'ServiceRole',
          value: ebServiceRole.roleName,
        },
        {
          namespace: 'aws:elasticbeanstalk:environment',
          optionName: 'EnvironmentType',
          value: 'LoadBalanced',
        },
        {
          namespace: 'aws:elasticbeanstalk:environment:proxy',
          optionName: 'ProxyServer',
          value: 'nginx',
        },
        {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MinSize',
          value: '1',
        },
        {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MaxSize',
          value: '3',
        },
      ],
    });

    // Output the S3 bucket name and CloudFront URL
    new cdk.CfnOutput(this, 'S3BucketName', {
      value: websiteBucket.bucketName,
      description: 'S3 bucket for frontend assets',
      exportName: 'VecinoMarketplaceS3BucketName',
    });

    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront URL for frontend',
      exportName: 'VecinoMarketplaceCloudFrontURL',
    });

    new cdk.CfnOutput(this, 'ElasticBeanstalkEnvironment', {
      value: ebEnvironment.environmentName,
      description: 'Elastic Beanstalk environment for backend',
      exportName: 'VecinoMarketplaceEBEnvironment',
    });
  }
}

const app = new cdk.App();
new VecinoMarketplaceStack(app, 'VecinoMarketplaceStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: 'Vecino Marketplace infrastructure',
});

app.synth();
