import json
import boto3
from .config import MODEL_ID, REGION_NAME
import logging  
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def model_invoke(prompt):
    bedrock_runtime = boto3.client('bedrock-runtime', region_name=REGION_NAME)
    try:
        native_request = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 190,
                "temperature": 0.7,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text", 
                                "text": prompt,
                                "cache_control": {
                                    "type": "ephemeral"
                                }
                            }             
                        ],
                    }
                ],
            }
        request = json.dumps(native_request)
        response = bedrock_runtime.invoke_model(modelId=MODEL_ID, body=request)
        logger.info(f"Response from model invoke: {response}")
        model_response_body = json.loads(response["body"].read())
        logger.info(f"Model response body: {model_response_body}")
        usage_metadata = model_response_body["usage"]
        cacheWriteInputTokens = usage_metadata["cache_creation_input_tokens"]
        cacheReadInputTokens = usage_metadata["cache_read_input_tokens"]
        input_tokens = usage_metadata["input_tokens"]
        output_tokens = usage_metadata["output_tokens"]
        response_text = model_response_body["content"][0]["text"]
        logger.info(f"Model invoked successfully: {response_text}, \n\n1.Input_tokens: {input_tokens}\n2.Output_tokens: {output_tokens}\n3.CacheReadInputTokens: {cacheReadInputTokens}\n4.CacheWriteInputTokens: {cacheWriteInputTokens}")
        return response_text
    except Exception as e:
        logger.error(f"Error in model_invoke: {e}")
        raise 