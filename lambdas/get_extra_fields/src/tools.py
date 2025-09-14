import pandas as pd
from .config import S3_BUCKET, S3_PREFIX, s3_client
from io import StringIO


def get_csv_content(client_code):
    file_key = f'{S3_PREFIX}client_{client_code}_transactions_3m.csv'
    response = s3_client.get_object(Bucket=S3_BUCKET, Key=file_key)
    csv_content = response['Body'].read().decode('utf-8-sig')
    return csv_content

def get_top3_categories(csv_content):
    transactions = pd.read_csv(StringIO(csv_content))
    grouped_transactions_by_category = transactions.groupby('category')['amount'].sum().reset_index()
    sorted_transaction_groups_by_sum_of_amounts = grouped_transactions_by_category.sort_values(by='amount', ascending=False)
    top3_categories = sorted_transaction_groups_by_sum_of_amounts.head(3)['category'].tolist()
    return top3_categories

def get_most_frequent_currency(csv_content):
    transactions = pd.read_csv(StringIO(csv_content))
    most_frequent_currency = transactions['currency'].mode()[0]
    return most_frequent_currency

def get_last_active_month(csv_content):
    transactions = pd.read_csv(StringIO(csv_content))
    filtered_transactions = transactions[
        (transactions['category'] == 'Такси') | 
        (transactions['category'] == 'Отели') | 
        (transactions['category'] == 'Путешествия')
    ].copy()
    
    filtered_transactions['date'] = pd.to_datetime(filtered_transactions['date'], format='%Y-%m-%d %H:%M:%S')
    filtered_transactions['month'] = filtered_transactions['date'].dt.to_period('M')
    
    month_counts = filtered_transactions['month'].value_counts()
    most_frequent_month = month_counts.idxmax().strftime('%Y-%m')
    
    return most_frequent_month