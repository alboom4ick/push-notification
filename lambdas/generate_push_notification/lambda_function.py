import json
from src.tools import create_response, get_normalized_humor_level, format_calendar_events, format_tone_of_voice, format_examples_of_push_notifications
from src.config import prompt
from src.model import model_invoke
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info(f"Received event: {json.dumps(event, default=str)}")
    http_method = event.get('requestContext', {}).get('http', {}).get('method') or event.get('httpMethod')
    raw_path = event.get('requestContext', {}).get('http', {}).get('path') or event.get('path', '/')
    origin = '*'
    logger.info(f"HTTP Method: {http_method}, Path: {raw_path}, Origin: {origin}")

    if http_method == 'GET':
        try:
            with open('src/resources/api_docs.json', 'r') as json_file:
                api_docs = json.load(json_file)
                return create_response(200, {'body': api_docs})
        except FileNotFoundError:
            return create_response(404, {'error': 'API docs not found'})


    if http_method == 'POST' and raw_path == '/generate-push-notification':
        try:
            raw_body = event.get('body', '')
            if not raw_body:
                raise ValueError("Request body is empty")
            body = json.loads(raw_body) if isinstance(raw_body, str) else raw_body
            
            current_time = body.get('current_time', '')

            user_info = body.get('user_info', {})
            name = user_info.get('name', '')
            status = user_info.get('status', '')
            age = user_info.get('age', 0)
            city = user_info.get('city', '')

            current_product = body.get('current_product', '')
            notification_product = body.get('notification_product', '')

            extra_fields = body.get('extra_fields', {})

            kz_calendar = body.get('kz_calendar', [])
            event_calendar = body.get('event_calendar', [])

            
            humor_level = body.get('humor_level', 0)
            humor_level = get_normalized_humor_level(age, humor_level)
            tone_of_voice = body.get('tone_of_voice', [])
            examples_of_push_notifications = body.get('examples_of_push_notifications', [])

            if not name:
                return create_response(400, {'error': 'Missing required parameter: name'})
            if not status:
                return create_response(400, {'error': 'Missing required parameter: status'})
            if age <= 0:
                return create_response(400, {'error': 'Invalid age parameter'})
            if not current_product:
                return create_response(400, {'error': 'Missing required parameter: current_product'})
            if not notification_product:
                return create_response(400, {'error': 'Missing required parameter: notification_product'})
    
            logger.info(f"Parameters received - name: {name}, status: {status}, age: {age}, current_product: {current_product}, notification_product: {notification_product}")
            formatted_prompt = prompt.format(
                current_time=current_time,
                name=name,
                status=status,
                age=age,
                city=city,
                current_product=current_product,
                notification_product=notification_product,
                kz_calendar=f"{kz_calendar}" if kz_calendar else "",
                event_calendar=format_calendar_events(event_calendar),
                humor_level=humor_level,
                tone_of_voice=format_tone_of_voice(tone_of_voice),
                examples_of_push_notifications=format_examples_of_push_notifications(examples_of_push_notifications)
            )

            if notification_product == "Карта для путешествий":
                last_active_month = extra_fields.get('last_active_month', '')

                formatted_prompt += f"""
                    <last_active_month>
                    {last_active_month}
                    </last_active_month>
                """
            elif notification_product == "Премиальная карта":
                formatted_prompt += f""""""
            elif notification_product == "Кредитная карта":
                top3_categories = extra_fields.get('top3_categories', '')
                formatted_prompt += f"""
                    <top3_categories>
                    {top3_categories}
                    </top3_categories>
                """
            elif notification_product == "Обмен валют":
                most_frequent_currency = extra_fields.get('most_frequent_currency', '')
                formatted_prompt += f"""
                    <most_frequent_currency>
                    {most_frequent_currency}
                    </most_frequent_currency>
                """
            elif notification_product == "Кредит наличными":  # Можно потом добавить другие артефакты для других
                formatted_prompt += f""""""
            elif notification_product == "Депозит Мультивалютный":
                formatted_prompt += f""""""
            elif notification_product == "Депозит Сберегательный":
                formatted_prompt += f""""""
            elif notification_product == "Депозит Накопительный":
                formatted_prompt += f""""""
            elif notification_product == "Инвестиции":
                formatted_prompt += f""""""
            elif notification_product == "Золотые слитки":
                formatted_prompt += f""""""            

            logger.info(f"Final prompt: {formatted_prompt}")
            model_response = model_invoke(formatted_prompt)
            return create_response(200, {'message': model_response})
        except ValueError as ve:
            return create_response(400, {'error': 'Invalid request', 'message': str(ve)})
        except Exception as e:
            logger.error(f"POST processing error: {e}", exc_info=True)
            return create_response(500, {'error': 'Internal server error', 'message': str(e)})

    return create_response(404, {'error': 'Not Found', 'message': f'Path {raw_path} not found'})