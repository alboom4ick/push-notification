import json
import math
from typing import Dict, List, Any, Optional

def create_response(status_code, body):
    return {
        'statusCode': status_code,
        'body': json.dumps(body, ensure_ascii=False) if isinstance(body, dict) else body
    }

def get_normalized_humor_level(age, humor_percentage):
    PEAK = 30   
    WIDTH = 20    
    factor = math.exp(-((age - PEAK) ** 2) / (2 * WIDTH ** 2))  
    humor_level = humor_percentage * factor
    return humor_level

def format_calendar_events(event_calendar: Dict[str, Any]) -> str:
    if not event_calendar:
        return ""
    
    events = event_calendar.get('events', [])
    if not events:
        return ""
    
    formatted_events = []
    for event in events:
        title = event.get('title', 'Без названия')
        
        date_info = event.get('date', {})
        when = date_info.get('when', '')
        
        address = event.get('address', [])
        location = ', '.join(address) if address else ''
        
        description = event.get('description', '')
        
        event_str = f"{title}"
        if when:
            event_str += f" ({when})"
        if location:
            event_str += f" - {location}"
        if description:
            event_str += f" - {description}"
            
        formatted_events.append(event_str)
    text = "●  	"
    text += "\n●  	".join(formatted_events)
    return text

def format_tone_of_voice(tone_items: List[Dict[str, Any]]) -> str:
    if not tone_items:
        return ""
    
    formatted_items = []
    for item in tone_items:
        label = item.get('label', '')
        if label:
            formatted_items.append(label)
    text = "●  	"
    text += "\n●  	".join(formatted_items)
    return text

def format_examples_of_push_notifications(examples: List[Dict[str, Any]]) -> str:
    if not examples:
        return ""
    
    formatted_examples = []
    for example in examples:
        label = example.get('label', '')
        text = example.get('text', '')
        
        if label and text:
            example_str = f"{label}: {text}"
            formatted_examples.append(example_str)
        elif text:  # If no label, just use text
            formatted_examples.append(text)

    text = "●  	"
    text += "\n●  	".join(formatted_examples)
    return text