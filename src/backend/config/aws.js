// Import required modules
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Function to configure AWS SDK
function configureAWS() {
    // Configure AWS SDK with credentials and region
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    // Set up AWS SDK to use the latest API versions
    AWS.config.apiVersions = {
        s3: '2006-03-01',
        ec2: '2016-11-15',
        rds: '2014-10-31',
        cloudwatch: '2010-08-01',
        kms: '2014-11-01',
        secretsmanager: '2017-10-17'
    };
}

// Call the configuration function
configureAWS();

// Create and export configured AWS service clients
module.exports = {
    s3: new AWS.S3(),
    ec2: new AWS.EC2(),
    rds: new AWS.RDS(),
    cloudWatch: new AWS.CloudWatch(),
    kms: new AWS.KMS(),
    secretsManager: new AWS.SecretsManager()
};

// Human tasks:
// TODO: Ensure AWS credentials are securely stored and not committed to version control
// TODO: Implement proper error handling for AWS service initialization
// TODO: Consider using IAM roles for EC2 instances instead of hardcoded credentials
// TODO: Set up CloudWatch alarms for monitoring AWS resource usage and costs