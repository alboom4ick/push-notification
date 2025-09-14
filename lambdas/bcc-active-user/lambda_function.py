import json
import csv
import boto3
from datetime import datetime
from io import StringIO

# Initialize S3 client
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    """
    AWS Lambda function to retrieve client information from S3-stored CSV file
    
    Expected request format:
    {
        "client_id": 1,
        "datetime": "2025-09-14T17:47:00+05:00"
    }
    """
    
    # Configuration
    S3_BUCKET = 'bcc-clients'  # Replace with your actual S3 bucket name
    S3_KEY = 'dataset/clients.csv'          # Replace with your actual S3 key path
    
    try:
        # Parse request body if it's a string (API Gateway integration)
        if isinstance(event, str):
            event = json.loads(event)
        elif 'body' in event:
            event = json.loads(event['body'])
        
        # Extract and validate request parameters
        client_id = event.get('client_id')
        request_datetime = event.get('datetime')
        
        # Validate required parameters
        if client_id is None:
            return create_error_response(
                400, 
                "MISSING_PARAMETER", 
                "client_id is required",
                request_datetime
            )
        
        # Validate client_id is integer
        try:
            client_id = int(client_id)
        except (ValueError, TypeError):
            return create_error_response(
                400,
                "INVALID_PARAMETER",
                "client_id must be a valid integer",
                request_datetime
            )
        
        # Load client data from S3
        clients_data = load_clients_from_s3(S3_BUCKET, S3_KEY)
        
        # Find client
        client_info = clients_data.get(client_id)
        
        if client_info:
            return create_success_response(client_info, request_datetime)
        else:
            return create_error_response(
                404,
                "CLIENT_NOT_FOUND",
                f"Client with ID {client_id} not found",
                request_datetime
            )
    
    except Exception as e:
        return create_error_response(
            500,
            "INTERNAL_ERROR",
            f"Internal server error: {str(e)}",
            request_datetime if 'request_datetime' in locals() else None
        )

def load_clients_from_s3(bucket, key):
    """
    Load and parse clients CSV file from S3
    Returns dictionary with client_id as key and client data as value
    """
    try:
        # Get object from S3
        response = s3_client.get_object(Bucket=bucket, Key=key)
        csv_content = response['Body'].read().decode('utf-8-sig')
        
        # Parse CSV content
        clients = {}
        csv_file = StringIO(csv_content)
        reader = csv.DictReader(csv_file)
        
        for row in reader:
            client_data = {
                "client_id": int(row["client_code"]),
                "name": row["name"].strip(),
                "status": row["status"].strip(),
                "age": int(row["age"]),
                "city": row["city"].strip(),
                "avg_monthly_balance_KZT": int(row["avg_monthly_balance_KZT"])
            }
            clients[client_data["client_id"]] = client_data
        
        return clients
    
    except Exception as e:
        raise Exception(f"Failed to load clients data from S3: {str(e)}")

def create_success_response(client_info, request_datetime):
    """Create successful response with client information"""
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST, OPTIONS"
        },
        "body": json.dumps({
            "success": True,
            "timestamp": get_current_timestamp(),
            "request_datetime": request_datetime,
            "client": client_info
        }, ensure_ascii=False)
    }

def create_error_response(status_code, error_code, message, request_datetime):
    """Create error response with proper status code and error information"""
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST, OPTIONS"
        },
        "body": json.dumps({
            "success": False,
            "timestamp": get_current_timestamp(),
            "request_datetime": request_datetime,
            "error": {
                "code": error_code,
                "message": message
            }
        }, ensure_ascii=False)
    }

def get_current_timestamp():
    """Get current timestamp in ISO format with timezone"""
    return datetime.now().astimezone().isoformat()
