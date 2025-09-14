import json
import csv
import boto3
import pandas as pd
import numpy as np
from datetime import datetime
from io import StringIO
import warnings

warnings.filterwarnings('ignore')

# Initialize S3 client
s3_client = boto3.client('s3')

# Configuration
S3_BUCKET = 'bcc-clients'
S3_PREFIX = 'dataset/'

def lambda_handler(event, context):
    """
    AWS Lambda function to analyze client and recommend products
    
    Expected request format:
    {
        "client_id": 1,
        "datetime": "2025-09-14T17:47:00+05:00"
    }
    """
    
    try:
        # Parse request body
        if isinstance(event, str):
            event = json.loads(event)
        elif 'body' in event:
            event = json.loads(event['body'])
        
        # Extract and validate request parameters
        client_id = event.get('client_id')
        request_datetime = event.get('datetime')
        
        if client_id is None:
            return create_error_response(400, "MISSING_PARAMETER", "client_id is required", request_datetime)
        
        try:
            client_id = int(client_id)
        except (ValueError, TypeError):
            return create_error_response(400, "INVALID_PARAMETER", "client_id must be a valid integer", request_datetime)
        
        # Load clients master data
        clients_df = load_clients_from_s3()
        
        # Check if target client exists
        if client_id not in clients_df['client_code'].values:
            return create_error_response(404, "CLIENT_NOT_FOUND", f"Client ID {client_id} not found", request_datetime)
        
        # Get client info
        client_info = clients_df[clients_df['client_code'] == client_id].iloc[0]
        
        # Load transaction and transfer data
        transactions, transfers = load_client_data(client_id)
        
        # Analyze the client
        analysis_results = analyze_single_client(client_id, client_info, transactions, transfers)
        
        # Create success response
        return create_success_response(analysis_results, request_datetime)
    
    except Exception as e:
        return create_error_response(500, "INTERNAL_ERROR", f"Internal server error: {str(e)}", request_datetime if 'request_datetime' in locals() else None)

def load_clients_from_s3():
    """Load clients CSV file from S3 and return as DataFrame"""
    try:
        response = s3_client.get_object(Bucket=S3_BUCKET, Key=f'{S3_PREFIX}clients.csv')
        csv_content = response['Body'].read().decode('utf-8-sig')
        
        clients = []
        csv_file = StringIO(csv_content)
        reader = csv.DictReader(csv_file)
        
        for row in reader:
            clients.append({
                'client_code': int(row['client_code']),
                'name': row['name'].strip(),
                'status': row['status'].strip(),
                'age': int(row['age']),
                'city': row['city'].strip(),
                'avg_monthly_balance_KZT': int(row['avg_monthly_balance_KZT'])
            })
        
        return pd.DataFrame(clients)
    
    except Exception as e:
        raise Exception(f"Failed to load clients data from S3: {str(e)}")

def load_client_data(client_code):
    """Load transaction and transfer data for a specific client from S3"""
    try:
        # Load transactions
        try:
            trans_key = f'{S3_PREFIX}client_{client_code}_transactions_3m.csv'
            response = s3_client.get_object(Bucket=S3_BUCKET, Key=trans_key)
            csv_content = response['Body'].read().decode('utf-8-sig')
            transactions = pd.read_csv(StringIO(csv_content))
            transactions['date'] = pd.to_datetime(transactions['date'])
        except s3_client.exceptions.NoSuchKey:
            transactions = pd.DataFrame()
        
        # Load transfers
        try:
            trans_key = f'{S3_PREFIX}client_{client_code}_transfers_3m.csv'
            response = s3_client.get_object(Bucket=S3_BUCKET, Key=trans_key)
            csv_content = response['Body'].read().decode('utf-8-sig')
            transfers = pd.read_csv(StringIO(csv_content))
            transfers['date'] = pd.to_datetime(transfers['date'])
        except s3_client.exceptions.NoSuchKey:
            transfers = pd.DataFrame()
            
        return transactions, transfers
    
    except Exception as e:
        return pd.DataFrame(), pd.DataFrame()

def score_travel_card(client_code, client_info, transactions, transfers):
    """Score for Travel Card - focus on travel, taxi, flights, hotels"""
    score = 0
    if transactions.empty:
        return score
    
    travel_categories = ['Такси', 'Отели', 'Путешествия', 'Авто']
    travel_spending = transactions[transactions['category'].str.contains('|'.join(travel_categories), case=False, na=False)]['amount'].sum()
    score = travel_spending * 0.04
    
    return score

def score_premium_card(client_code, client_info, transactions, transfers):
    """Score for Premium Card with detailed cashback tiers"""
    score = 0
    avg_balance = client_info['avg_monthly_balance_KZT']
    
    if avg_balance < 500000:
        return 0
    
    score += avg_balance * 0.0001
    
    if not transactions.empty:
        monthly_spending = transactions.groupby(pd.Grouper(key='date', freq='M'))['amount'].sum()
        avg_monthly_spending = monthly_spending.mean() if not monthly_spending.empty else 0
        
        if avg_balance >= 6000000:
            base_cashback_rate = 0.04
        elif avg_balance >= 1000000:
            base_cashback_rate = 0.03
        else:
            base_cashback_rate = 0.02
        
        base_cashback = min(avg_monthly_spending * base_cashback_rate, 100000)
        score += base_cashback
        
        premium_categories = ['Ювелирные украшения', 'Косметика и Парфюмерия', 'Кафе и рестораны']
        premium_spending = transactions[transactions['category'].str.contains('|'.join(premium_categories), case=False, na=False)]['amount'].sum()
        premium_cashback = min(premium_spending * 0.04, 100000)
        score += premium_cashback
    
    if not transfers.empty:
        atm_count = len(transfers[transfers['type'] == 'atm_withdrawal'])
        score += atm_count * 2000
    
    return score

def score_credit_card(client_code, client_info, transactions, transfers):
    """Score for Credit Card - online services, installments"""
    score = 0
    
    if not transactions.empty:
        online_categories = ['Едим дома', 'Смотрим дома', 'Играем дома']
        online_spending = transactions[transactions['category'].str.contains('|'.join(online_categories), case=False, na=False)]['amount'].sum()
        score += online_spending * 0.01
        
        top_categories = transactions[~transactions['category'].str.contains('|'.join(online_categories), case=False, na=False)]
        if not top_categories.empty:
            top_3_spend = top_categories.groupby('category')['amount'].sum().nlargest(3).sum()
            score += top_3_spend * 0.01
    
    if not transfers.empty:
        installments = transfers[transfers['type'].str.contains('installment|cc_repayment', case=False, na=False)]
        if len(installments) > 0:
            score *= 2
    
    return score

def score_currency_exchange(client_code, client_info, transactions, transfers):
    """Score for Currency Exchange - FX operations, USD/EUR transactions"""
    score = 0
    
    if not transfers.empty:
        fx_operations = transfers[transfers['type'].str.contains('fx_buy|fx_sell', case=False, na=False)]
        score += len(fx_operations) * 10000
        
    if not transactions.empty:
        foreign_curr = transactions[transactions['currency'].isin(['USD', 'EUR', 'GBP'])]
        score += len(foreign_curr) * 5000
        score += foreign_curr['amount'].sum() * 0.001
    
    return score

def score_cash_credit(client_code, client_info, transactions, transfers):
    """Score for Cash Credit - outflows vs inflows, loan payments"""
    score = 0
    
    if not transfers.empty:
        outflows = transfers[transfers['direction'] == 'out']['amount'].sum()
        inflows = transfers[transfers['direction'] == 'in']['amount'].sum()
        net_deficit = outflows - inflows
        
        if net_deficit > 0:
            score += net_deficit * 0.001
        
        loan_payments = transfers[transfers['type'].str.contains('loan_payment', case=False, na=False)]
        if len(loan_payments) > 0:
            score *= 0.5
    
    if client_info['avg_monthly_balance_KZT'] < 100000 and not transactions.empty:
        if len(transactions) > 50:
            score *= 1.5
    
    return score

def score_multicurrency_deposit(client_code, client_info, transactions, transfers):
    """Score for Multi-currency Deposit (14.5%)"""
    score = 0
    avg_balance = client_info['avg_monthly_balance_KZT']
    
    if avg_balance > 300000:
        score += (avg_balance * 0.145 / 12) * 3
        
        if not transfers.empty:
            fx_count = len(transfers[transfers['type'].str.contains('fx', case=False, na=False)])
            if fx_count > 0:
                score *= 1.5
        
        if not transactions.empty:
            monthly_spending = transactions.groupby(pd.Grouper(key='date', freq='M'))['amount'].sum()
            if len(monthly_spending) > 1:
                spending_volatility = monthly_spending.std() / monthly_spending.mean() if monthly_spending.mean() > 0 else 1
                if spending_volatility < 0.3:
                    score *= 1.2
    
    return score

def score_saving_deposit(client_code, client_info, transactions, transfers):
    """Score for Saving Deposit (16.5%)"""
    score = 0
    avg_balance = client_info['avg_monthly_balance_KZT']
    
    if avg_balance > 1000000:
        score += (avg_balance * 0.165 / 12) * 3
        
        if not transactions.empty:
            total_spending = transactions['amount'].sum()
            spending_ratio = total_spending / (avg_balance * 3) if avg_balance > 0 else 1
            if spending_ratio < 0.5:
                score *= 1.3
            
            monthly_spending = transactions.groupby(pd.Grouper(key='date', freq='M'))['amount'].sum()
            if len(monthly_spending) > 1:
                spending_volatility = monthly_spending.std() / monthly_spending.mean() if monthly_spending.mean() > 0 else 1
                if spending_volatility < 0.2:
                    score *= 1.2
    
    return score

def score_accumulative_deposit(client_code, client_info, transactions, transfers):
    """Score for Accumulative Deposit (15.5%)"""
    score = 0
    avg_balance = client_info['avg_monthly_balance_KZT']
    
    if 100000 < avg_balance < 1000000:
        score += (avg_balance * 0.155 / 12) * 3
        
        if not transfers.empty:
            deposits = transfers[(transfers['direction'] == 'in') & 
                               (transfers['type'].str.contains('deposit|card_in|p2p_in', case=False, na=False))]
            
            if len(deposits) > 5:
                if not deposits.empty:
                    deposits['month'] = deposits['date'].dt.to_period('M')
                    monthly_deposits = deposits.groupby('month').size()
                    if len(monthly_deposits) >= 2:
                        score *= 1.5
    
    return score

def score_investments(client_code, client_info, transactions, transfers):
    """Score for Investments"""
    score = 0
    avg_balance = client_info['avg_monthly_balance_KZT']
    
    if avg_balance > 500000:
        score += avg_balance * 0.001
        
        if not transfers.empty:
            inflows = transfers[transfers['direction'] == 'in'].copy()
            if not inflows.empty and len(inflows) > 10:
                inflows['month'] = inflows['date'].dt.to_period('M')
                monthly_income = inflows.groupby('month')['amount'].sum()
                
                if len(monthly_income) >= 2:
                    first_half = monthly_income.iloc[:len(monthly_income)//2].mean()
                    second_half = monthly_income.iloc[len(monthly_income)//2:].mean()
                    
                    if first_half > 0:
                        growth_rate = (second_half - first_half) / first_half
                        if growth_rate > 0.1:
                            score *= (1 + growth_rate)
        
        if client_info['status'] == 'Премиальный клиент':
            score *= 1.3
    
    return score

def score_gold_bars(client_code, client_info, transactions, transfers):
    """Score for Gold Bars"""
    score = 0
    avg_balance = client_info['avg_monthly_balance_KZT']
    
    if avg_balance > 3000000:
        score += avg_balance * 0.0001
        
        if not transfers.empty:
            investment_transfers = transfers[transfers['type'].str.contains('deposit|investment', case=False, na=False)]
            if len(investment_transfers) > 10:
                score *= 1.5
    
    return score

def analyze_single_client(client_code, client_info, transactions, transfers):
    """Analyze a single client and return product scores"""
    
    scores = {
        'Карта для путешествий': score_travel_card(client_code, client_info, transactions, transfers),
        'Премиальная карта': score_premium_card(client_code, client_info, transactions, transfers),
        'Кредитная карта': score_credit_card(client_code, client_info, transactions, transfers),
        'Обмен валют': score_currency_exchange(client_code, client_info, transactions, transfers),
        'Кредит наличными': score_cash_credit(client_code, client_info, transactions, transfers),
        'Депозит мультивалютный': score_multicurrency_deposit(client_code, client_info, transactions, transfers),
        'Депозит сберегательный': score_saving_deposit(client_code, client_info, transactions, transfers),
        'Депозит накопительный': score_accumulative_deposit(client_code, client_info, transactions, transfers),
        'Инвестиции': score_investments(client_code, client_info, transactions, transfers),
        'Золотые слитки': score_gold_bars(client_code, client_info, transactions, transfers)
    }
    
    # Sort products by score (descending)
    sorted_products = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    
    # Get current product from transaction data
    current_product = transactions['product'].iloc[0] if not transactions.empty else "Unknown"
    
    # Get best and second best products
    best_product = sorted_products[0][0] if len(sorted_products) > 0 else "N/A"
    second_best_product = sorted_products[1][0] if len(sorted_products) > 1 else "N/A"
    
    # Check if client already has the best product
    if best_product == current_product:
        notification_product = second_best_product
        status_message = "Client already has the best product"
    else:
        notification_product = best_product
        status_message = "New product recommendation"
    
    # Create output data
    result = {
        'client_id': int(client_code),
        'name': client_info['name'],
        'current_product': current_product,
        'best_product': best_product,
        'second_best_product': second_best_product,
        'notification_product': notification_product,
        'best_score': float(sorted_products[0][1]),
        'second_best_score': float(sorted_products[1][1]),
        'status': status_message
    }
    
    return result

def create_success_response(analysis_results, request_datetime):
    """Create successful response with analysis results"""
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
            "analysis": analysis_results
        }, ensure_ascii=False)
    }

def create_error_response(status_code, error_code, message, request_datetime):
    """Create error response"""
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
