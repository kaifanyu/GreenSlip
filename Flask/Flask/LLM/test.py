import datetime

# Example dictionary
my_dict = {
    'store': 'FlightBridge',
    'date': '01Feb2024',
    'items': [
        {'name': 'United Airlines Flight SBA to KOA', 'cost': 309.91, 'estimated_CO2_emissions_kg': 500},
        {'name': 'Taxes', 'cost': 'invalid', 'estimated_CO2_emissions_kg': 0},
        {'name': 'Booking Fee', 'cost': 14.0, 'estimated_CO2_emissions_kg': 'invalid'}
    ]
}

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
            try:
                date_obj = datetime.datetime.strptime(date_str, '%d%b%Y')
                return date_obj.strftime('%d/%m/%Y')
            except ValueError:
                # If parsing fails, return the default date
                return '06222024'

# Check if the date is an integer, if not, convert it
if not isinstance(my_dict['date'], int):
    my_dict['date'] = convert_date(my_dict['date'])

# Iterate through each item in the 'items' list to rename the key and validate values
for item in my_dict['items']:
    if 'estimated_CO2_emissions_kg' in item:
        try:
            item['estimated_CO2_emissions'] = float(item.pop('estimated_CO2_emissions_kg'))
        except (ValueError, TypeError):
            item['estimated_CO2_emissions'] = 0
    
    if 'cost' in item:
        try:
            item['cost'] = float(item['cost'])
        except (ValueError, TypeError):
            item['cost'] = 0

print(my_dict)
