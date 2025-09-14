import boto3

s3_client = boto3.client('s3')

# Configuration
S3_BUCKET = 'bcc-clients'
S3_PREFIX = 'dataset/'