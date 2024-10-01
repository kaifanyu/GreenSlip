from flask import jsonify
import os
import pandas as pd
import base64
from openai import OpenAI
import json
import re
import datetime


# Open the image file and encode it as a base64 string
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

# Given openai's output, parse it as a dictionary object and return it
def parse_output(response):
    pattern = r"`json\s+([\s\S]*?)\s+`"
    match = re.search(pattern, response)
    data_dict = {}
    if match:
        json_string = match.group(1).strip()
        try:
            # Convert JSON string to a Python dictionary
            data_dict = json.loads(json_string)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
    else:
        print("No JSON data found")
        try:
            data_dict = response 
        except ValueError:
            print("NOT JSON CAN't MAKE")
            print(response)

    print("DATA_DICT: ", data_dict)
    return data_dict

# Given an image path, get the openai report
def parse_receipt(filepath):

    IMAGE_PATH = filepath
    EX_IMAGE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "files", "Receipts", "resturant-receipt.png")
    print("IMGPATH: ", IMAGE_PATH)
    print("EXP: ", EX_IMAGE_PATH)

    # Set the API key and model name
    MODEL="gpt-4o"
    client = OpenAI(api_key="")

    base64_image = encode_image(IMAGE_PATH)
    example_image = encode_image(EX_IMAGE_PATH)

    response = client.chat.completions.create(
    model=MODEL,
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant. Your task is to parse images of receipts to determine the items purchased, the cost of each item, \
                and estimate the carbon emissions for each item based on the best available online sources. Also, categorize each item into one of the following categories based on its nature: Utilities, Groceries, Gas, Other, Restaurants, Transportation, Personal, Electronics, Rent. \
                If the item does not clearly fit into one of these categories, categorize it as 'Other'. You should actively search the web to find the most accurate and up-to-date estimates for the carbon emissions of each product. \
                It it is an electricity bill, you should find the total kilowatts used, and multiply that by 1.1kg of CO2 per kilowatts, and store the total value.\
                Summarize this information in a structured JSON format. The output should include individual entries for each item with its name, cost, estimated CO2 emissions, and category. Additionally, provide the name of the store and the date of purchase if found. \
                If the date or store is not found or doesn't make sense, put 'invalid'. Your response should handle various receipt formats accurately and provide consistent output. \
                Do not give an explanation. JSON format only. Cite multiple sources for carbon emissions estimates where possible."
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Extract the items, costs, and estimated carbon emissions from the provided receipt image. Return the results in the specified JSON format."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{base64_image}"
                    }
                }
            ],
            "example": {
                "image_url": f"data:image/png;base64,{example_image}",
                "expected_output": {
                    "Products": {
                        "Fish & Chips Bowl": {
                            "Cost": "$17.98",
                            "estimated_CO2_emissions": "3.4kg",
                            "Category": "Restaurants"
                        },
                        "Drinks": {
                            "Cost": "$3.98",
                            "estimated_CO2_emissions": "0.4kg",
                            "Category": "Restaurants"
                        },
                        "Fish Spicy Soup": {
                            "Cost": "$7.96",
                            "estimated_CO2_emissions": "5.0kg",
                            "Category": "Restaurants"
                        }
                    },
                    "Date": "10/19/2019",
                    "Store": "Fish & Chips Restaurant"
                }
            }
        }
    ],
    temperature=0.0,
    seed=42,
    top_p=0,
)


    output = response.choices[0].message.content
    try:
        result = json.loads(output)  # Ensure output is a JSON string and convert it
    except json.JSONDecodeError:
        print("Failed to parse JSON from response")
        return parse_output(output)  # Or handle it some other way

    return result


# Function to convert date string to desired format
def convert_date(date_str):
    try:
        # Check if the date is already in the correct format
        if datetime.datetime.strptime(date_str, '%d/%m/%Y'):
            return date_str
    except ValueError:
        pass

    try:
        # Parse the date string
        date_obj = datetime.datetime.strptime(date_str, '%d %b %Y')
        # Convert to the desired format
        return date_obj.strftime('%d/%m/%Y')
    except ValueError:
        # Try another format if the first one fails
        try:
            date_obj = datetime.datetime.strptime(date_str, '%d %B %Y')
            return date_obj.strftime('%d/%m/%Y')
        except ValueError:
                # If parsing fails, return the default date
                return '06/22/2024'

def spellcheck(my_dict):
    date_pattern_4digit_year = re.compile(r'^\d{2}/\d{2}/\d{4}$')
    date_pattern_2digit_year = re.compile(r'^\d{2}/\d{2}/\d{2}$')

    if 'date' in my_dict and not isinstance(my_dict['date'], int):
        if not date_pattern_4digit_year.match(my_dict['date']):
            if date_pattern_2digit_year.match(my_dict['date']):
                month, day, year = my_dict['date'].split('/')
                my_dict['date'] = f"{month}/{day}/20{year}"
            else:
                my_dict['date'] = convert_date(my_dict['date'])

    for item in my_dict['items']:
        for key, value in list(item.items()):  # Make a copy of the dictionary items for safe iteration
            if value in ['invalid', 'N/A', 'NA']:
                item[key] = 0
            elif key == 'estimated_CO2_emissions_kg':
                try:
                    item['estimated_CO2_emissions'] = float(item.pop('estimated_CO2_emissions_kg'))
                except (ValueError, TypeError):
                    item['estimated_CO2_emissions'] = 0
            elif key == 'cost':
                try:
                    item['cost'] = float(value)
                except (ValueError, TypeError):
                    item['cost'] = 0
    
    return my_dict


def process(filename):

    current_filepath = os.path.abspath(__file__)
    parent_dir = os.path.dirname(os.path.dirname(current_filepath))
    receipts_dir = os.path.join(parent_dir, "files", "Receipts")
    filepath = os.path.join(receipts_dir, filename)

    for attempt in range(3):
        output = parse_receipt(filepath)
        if output:
            clean = spellcheck(output)
            result = {}
            result[clean['store']] = clean
            print("CLEAN: ", clean)
            return result
        print(f"Attempt {attempt + 1} failed, retrying...")

    print("Failed to parse the receipt after 3 attempts.")
    return 
