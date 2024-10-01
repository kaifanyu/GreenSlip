# GreenSlip: Empowering Sustainable Financial Decisions

<div align=center>
  <image src='https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/931/087/datas/gallery.jpg' height=200>
</div>

GreenSlip is an innovative platform that bridges the gap between financial management and environmental responsibility. With GreenSlip, users can easily upload receipts, track their spending habits, and gain insight into their carbon footprint. The platform is built with **React** on the frontend and **Flask** on the backend, utilizing **OpenAI** technology to parse receipts and compare them with carbon emission data, providing users with a detailed view of the environmental cost of their purchases. For more information check out my devpost

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![ChatGPT](https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white)

## Features

- **Receipt Upload**: Users can upload images or PDFs of shopping receipts and utility bills.
- **Data Extraction**: Advanced OCR and AI-powered data parsing extracts detailed financial information from uploaded receipts.
- **Carbon Emissions Tracking**: Each item from the receipt is compared against a known database of carbon emissions, offering insights into the environmental impact of purchases.
- **Interactive Dashboard**: Users can track their spending habits and carbon footprint through an intuitive and visually appealing dashboard.
- **Time-based Analytics**: Filter data by monthly, yearly, or all-time records to track progress over time.

<div align=center>
  <image src='https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/931/048/datas/gallery.jpg' height=400>
  <image src='https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/930/941/datas/gallery.jpg' height=400>
</div>

## Tech Stack

- **Frontend**: 
  - React
  - Chart.js (for data visualization)
  - Bootstrap (for styling)
  
- **Backend**: 
  - Flask (API and backend logic)
  - pdf2image (for converting PDFs to images)
  - OpenAI (custom-engineered prompts to extract financial and carbon emission data)
  
- **Database**:
  - Firebase (for authenticating user login and user records)

## How It Works

1. **User Registration & Authentication**: Users sign up and log in to the platform.
2. **Receipt Upload**: Users upload shopping receipts and utility bills in image or PDF formats.
3. **Data Processing**: The system uses `pdf2image` to convert PDFs into images, and OpenAI is leveraged through custom-engineered prompts to extract relevant financial and product information from the receipt.
4. **Carbon Emission Analysis**: Extracted products are compared against a database that contains the average carbon emissions for various products.
5. **Dashboard Visualization**: Users can see their financial habits and the associated carbon footprint visualized through interactive charts.

## Setup

### Prerequisites

- **Node.js**: You will need Node.js installed to run the React frontend.
- **Python**: Ensure Python 3.x is installed for the Flask backend.
- **pip**: Install pip for managing Python packages.
- **OpenAI API Key**: Obtain an OpenAI API key to enable the AI-powered receipt parsing.
- **Database**: SQLite is used by default. You can configure PostgreSQL if required.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/greenslip.git
    cd greenslip
    ```

2. Install backend dependencies:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3. Install frontend dependencies:
    ```bash
    cd ../frontend
    npm install
    ```

4. Set up environment variables:
   - Create a `.env` file in the `backend` directory and add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key
     ```

5. Start the Flask backend:
    ```bash
    cd backend
    flask run
    ```

6. Start the React frontend:
    ```bash
    cd ../frontend
    npm start
    ```

## Usage

1. Navigate to the site (by default at `http://localhost:3000`).
2. Register and log in.
3. Upload receipts and utility bills through the user interface.
4. Explore the interactive dashboard to see financial spending patterns and associated carbon emissions.

## Challenges and Accomplishments

- **Challenges**:
  - Balancing frontend, backend, and AI integration within a short time frame.
  - Parsing complex receipt data efficiently using OCR and OpenAI technology.
  
- **Accomplishments**:
  - Aesthetic and functional user interface with smooth user interactions.
  - Data visualization that provides clear insights into financial health and environmental impact.

## What's Next

- **E-Receipt Integration**: Incorporate digital receipt formats to reduce paper waste.
- **Enhanced Data Insights**: Provide personalized tips for reducing spending and carbon emissions based on user behavior.
