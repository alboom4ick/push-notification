import json
import botocore
from src.tools import get_last_active_month, get_most_frequent_currency, get_top3_categories, get_csv_content

def lambda_handler(event, context):
    try:
        if isinstance(event, str):
            event = json.loads(event)
        if 'body' in event:
            event = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        
        if 'client_code' not in event or 'notification_product' not in event:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        client_code = event['client_code']
        notification_product = event['notification_product']
        
        try:
            csv_content = get_csv_content(client_code)
        except botocore.exceptions.ClientError as s3_error:
            if s3_error.response['Error']['Code'] == 'NoSuchKey':
                return {
                    'statusCode': 404,
                    'body': json.dumps({
                        'error': f'S3 Loading Error: Transaction data not found for client {client_code}'
                    })
                }
            raise s3_error

        extra_fields = {}
        product_handlers = {
            "Карта для путешествий": lambda: {'last_active_month': get_last_active_month(csv_content)},
            "Кредитная карта": lambda: {'top3_categories': get_top3_categories(csv_content)},
            "Обмен валют": lambda: {'most_frequent_currency': get_most_frequent_currency(csv_content)}
        }

        if notification_product in product_handlers:
            extra_fields = product_handlers[notification_product]()

        return {
            'statusCode': 200,
            'body': json.dumps(extra_fields, ensure_ascii=False)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error while taking "extra_fields"': str(e)}, ensure_ascii=False)
        }


