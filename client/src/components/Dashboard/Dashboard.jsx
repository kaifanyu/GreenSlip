import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import LineChart from './LineChart';
import PieChart from './PieChart'; 
import BarChart from './BarChart';
import './Dashboard.css'
import OpenAI from "openai";

const openai_key = '';

const openai = new OpenAI({apiKey: openai_key,  dangerouslyAllowBrowser: true});

const firebaseConfig = {};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

function Dashboard() {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [chartCO2Points, setChartCO2DataPoints] = useState([]);
  const [showCO2, setShowCO2] = useState(false);
  const [monthVal, setMonthVal] = useState({})
  const [selectedMonth, setSelectedMonth] = useState("06");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [originalLabels, setOriginalLabels] = useState([]);
  const [originalDataPoints, setOriginalDataPoints] = useState([]);
  const [originalCO2Points, setOriginalCO2Points] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [spendingAnalysis, setSpendingAnalysis] = useState('');
  const [emissionAnalysis, setEmissionAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  // Mapping month names to their respective numerical values
  const monthMapping = {
    "January": "01", "February": "02", "March": "03",
    "April": "04", "May": "05", "June": "06",
    "July": "07", "August": "08", "September": "09",
    "October": "10", "November": "11", "December": "12"
  };

  const currentDate = new Date('2024-06-23');

  const co2Color = "#132a13"
  const costColor = "#90a955"
  const toggleChartData = () => {setShowCO2(!showCO2);};

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login'); // Redirect to login if there is no user
      return;
    }
    setUserEmail(auth.currentUser.email); // Set the user email in state
    fetchEntries(auth.currentUser.uid);
  }, [auth.currentUser]);
  
  
  const fetchEntries = async (uid) => {
    const entriesRef = collection(db, "Users", uid, "Products");
    const snapshot = await getDocs(entriesRef);

    const stores = {};
    const monthly = {};
    const dateCostMap = {};
    const dateCO2Map = {};

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      Object.keys(data).filter(key => typeof data[key] === 'object' && data[key].store).forEach(key => {
        const storeName = data[key].store;
        const date = data[key].date;
        const newdate = new Date(date);
        const monthYearKey = `${newdate.getFullYear()}-${(newdate.getMonth() + 1).toString().padStart(2, '0')}`;
    
        if (!stores[storeName]) {
          stores[storeName] = {
            totalCost: 0,
            totalCO2: 0,
            items: []
          };
        }
    
        if (!monthly[monthYearKey]) {
          monthly[monthYearKey] = {
            Category:{
              Utilities: 0,
              Groceries: 0,
              Gas: 0,
              Other: 0,
              Resturants: 0,
              Transportation: 0,
              Personal: 0,
              Rent: 0,
              Electronics: 0
              },
              totalCost: 0,
              totalCO2: 0,
          };
        }
    
        data[key].items.forEach(item => {
          stores[storeName].items.push(item);
          stores[storeName].totalCost += item.cost;
          const co2EmissionsString = String(item.estimated_CO2_emissions);
          const co2Value = parseFloat(co2EmissionsString.replace(' kg CO2e', '').replace(' kg CO2e per serving', '').replace(' kg CO2e per drink', ''));
          stores[storeName].totalCO2 += co2Value;

          // Process category counts for the month
          const itemCategory = item.category || "Other"; // Default to "Other" if category is undefined or empty
          monthly[monthYearKey].Category[itemCategory] = (monthly[monthYearKey].Category[itemCategory] || 0) + 1;
          
          if (monthYearKey) {
            monthly[monthYearKey].totalCost += item.cost;
            monthly[monthYearKey].totalCO2 += co2Value;
          }
    
          if (date) {
            if (dateCostMap[date]) {
              dateCostMap[date] += item.cost;
            } else {
              dateCostMap[date] = item.cost;
            }
            if (dateCO2Map[date]) {
              dateCO2Map[date] += co2Value;
            } else {
              dateCO2Map[date] = co2Value;
            }
          }
        });
      });
    });
    
    
    setStoreData(stores);
    setMonthVal(monthly);

    // Process and set the state for chart data
    const sortedDates = Object.keys(dateCostMap).sort((a, b) => new Date(a) - new Date(b)); // Sort dates chronologically
    const sortedCosts = sortedDates.map(date => dateCostMap[date]);
    const sortedCO2 = sortedDates.map(date => dateCO2Map[date]);

    // Assume you have state variables to hold these
    setChartLabels(sortedDates);
    setChartDataPoints(sortedCosts);
    setChartCO2DataPoints(sortedCO2);

    // Set original data states
    setOriginalLabels(sortedDates);
    setOriginalDataPoints(sortedCosts);
    setOriginalCO2Points(sortedCO2);

  };


  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const processDataForMonth = () => {
    setActiveFilter('Month');
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    const filteredLabels = originalLabels.filter(date => new Date(date) >= lastMonth);
    setChartLabels(filteredLabels);
    setChartDataPoints(filteredLabels.map(date => originalDataPoints[originalLabels.indexOf(date)]));
    setChartCO2DataPoints(filteredLabels.map(date => originalCO2Points[originalLabels.indexOf(date)]));
  };
  
  const processDataForYear = () => {
    setActiveFilter('Year');
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const filteredLabels = originalLabels.filter(date => new Date(date) >= lastYear);
    setChartLabels(filteredLabels);
    setChartDataPoints(filteredLabels.map(date => originalDataPoints[originalLabels.indexOf(date)]));
    setChartCO2DataPoints(filteredLabels.map(date => originalCO2Points[originalLabels.indexOf(date)]));
  };
  
  const processDataForAll = () => {
    setActiveFilter('All');
    setChartLabels(originalLabels);
    setChartDataPoints(originalDataPoints);
    setChartCO2DataPoints(originalCO2Points);
  };
  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert('Failed to logout: ' + error.message);
    }
  };

  console.log("MONTH: ", monthVal)
  console.log("Val: ", chartLabels)
  
  const currentKey = `${selectedYear}-${selectedMonth}`;
  const categories = monthVal[currentKey]?.Category || {};
  const categoryLabels = Object.keys(categories);
  const categoryValues = Object.values(categories);
  const categoryColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#FFC0CB', '#708090'];

  const buttonStyle = (filterName) => ({
    backgroundColor: activeFilter === filterName ? '#4CAF50' : '#f0f0f0',
    color: activeFilter === filterName ? 'white' : 'black',
    // Add more styling as needed
  });
    const [expandedStore, setExpandedStore] = useState(null);
    const [showAllStores, setShowAllStores] = useState(false);  // New state to control visibility of all stores

    const toggleExpand = (storeName) => {
        setExpandedStore(expandedStore === storeName ? null : storeName);
    };

    const toggleAllStores = () => {
        setShowAllStores(!showAllStores);  // Toggle between showing all stores and limited stores
    };
    const displayedStores = showAllStores ? Object.entries(storeData) : Object.entries(storeData).slice(0, 6);
    const calculateScores = () => {
      const currentDate = new Date();
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const monthBeforeLast = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
  
      const lastMonthKey = `${lastMonth.getFullYear()}-${(lastMonth.getMonth() + 1).toString().padStart(2, '0')}`;
      const monthBeforeLastKey = `${monthBeforeLast.getFullYear()}-${(monthBeforeLast.getMonth() + 1).toString().padStart(2, '0')}`;
  
      const lastMonthData = monthVal[lastMonthKey] || { totalCost: 0, totalCO2: 0 };
      const monthBeforeLastData = monthVal[monthBeforeLastKey] || { totalCost: 0, totalCO2: 0 };
  
      // Calculate changes
      const financialChange = lastMonthData.totalCost - monthBeforeLastData.totalCost;
      const emissionChange = lastMonthData.totalCO2 - monthBeforeLastData.totalCO2;
  
      // Define scaling factors for normalizing scores
      const financialTau = 1000; // Scaling factor for financial data
      const emissionTau = 200;  // Scaling factor for emission data
  
      // Calculate normalized scores
      const financialScore = Math.round(Math.exp(-Math.abs(financialChange) / financialTau) * 100);
      const emissionScore = Math.round(Math.exp(-Math.abs(emissionChange) / emissionTau) * 100);
  
      // Return scores and changes
      return { 
          financialScore, 
          emissionScore, 
          financialChange, 
          emissionChange 
      };
  };
  

  async function fetchFeedback(data) {
    // Constructing a meaningful prompt from the passed data
    const prompt = `Analyze the following spending and emission data from the last 30 days and provide feedback on:
    1) How to reduce spending in a way that aligns with sustainability goals.
    2) Suggestions for reducing carbon emissions based on the categories and amounts.
    Data: ${JSON.stringify(data)}`;
  
    setIsLoading(true);  // Set loading state to true when the API call begins
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant that provides financial and environmental feedback based on provided data." },
          { role: "user", content: prompt }
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 250  // Adjust token limit based on expected length of feedback
      });
  
      console.log('API Response:', completion);
      if (completion && completion.choices && completion.choices.length > 0) {
        const feedbackText = completion.choices[0].message.content;
        console.log('Feedback received:', feedbackText);
  
        const [spendingAnalysis, emissionAnalysis] = feedbackText.split('\n');
        setIsLoading(false);  // Set loading state to false once data is received
        return { spendingAnalysis, emissionAnalysis };
      }
    } catch (error) {
      console.error('Failed to fetch feedback from OpenAI:', error);
      setIsLoading(false);  // Ensure loading state is false on error
      return { 
        spendingAnalysis: "Unable to retrieve analysis at this time.",
        emissionAnalysis: "Unable to retrieve analysis at this time."
      };
    }
  }
  
  const generateAnalysis = async () => {
    const values = monthVal[currentKey]?.Category || {};
    const feedback = await fetchFeedback(values);
    
    setSpendingAnalysis(feedback.spendingAnalysis);
    setEmissionAnalysis(feedback.emissionAnalysis);
  };

  useEffect(() => {
    if (Object.keys(monthVal).length > 0) {
      console.log("monthVal is populated, now running analysis.");
      generateAnalysis();
    } else {
      console.log("monthVal is still empty.");
    }
  }, [monthVal]);
  
  const generateFeedback = (score, change, isFinancial = false) => {
      const scoreType = isFinancial ? "Financial" : "CO2 Emission";
      const measureUnit = isFinancial ? "currency" : "kg CO2e";
      const positiveChange = change > 0;
      const direction = positiveChange ? "increase" : "decrease";
      const percentageChange = Math.abs((change / (score - change)) * 100).toFixed(1);

      let feedback = `Your ${scoreType} Score is ${score}. `;
      if (score >= 75) {
          feedback += `This is considered high, indicating a significant ${direction} in your ${isFinancial ? "spending" : "emissions"} compared to the previous period. `;
          feedback += `This ${direction} was approximately ${Math.abs(change).toFixed(2)} ${measureUnit}, which is a ${percentageChange}% change. `;
      } else if (score < 75 && score >= 50) {
          feedback += `This is an average score, suggesting moderate changes in your ${isFinancial ? "expenses" : "emissions"}. `;
          feedback += `The ${direction} of ${Math.abs(change).toFixed(2)} ${measureUnit} (${percentageChange}%) points to nominal adjustments rather than significant shifts. `;
      } else {
          feedback += `This score is low, which may be cause for concern as it reflects a substantial ${direction} in ${isFinancial ? "spending" : "emissions"}. `;
          feedback += `The ${direction} was by ${Math.abs(change).toFixed(2)} ${measureUnit}, or ${percentageChange}%, indicating a need for review and possible adjustments in your habits. `;
      }
      return feedback;
  };

  
    const { financialScore, emissionScore, financialChange, emissionChange } = calculateScores();

    // Generate feedback using the scores and the respective changes
    const financialFeedback = generateFeedback(financialScore, financialChange, true);
    const emissionFeedback = generateFeedback(emissionScore, emissionChange);

    const EmissionsDashboard = ({ userEmissions, averageEmissions }) => {
      const comparison = ((userEmissions / averageEmissions) - 1) * 100;
    
      const getRecommendations = () => {
          if (comparison > 0) {
              return "Your emissions are above average. Consider switching to energy-efficient appliances or reducing meat consumption.";
          } else if (comparison < 0) {
              return "Great job! Your emissions are below average. Keep up the good practices and explore new ways to further reduce your footprint.";
          }
          return "You are right at the average. Look for opportunities to reduce your emissions to become an environmental leader.";
      };
  
      const companies = [
          "China Coal", "Saudi Aramco", "Gazprom OAO", "National Iranian Oil Co", 
          "ExxonMobil Corp", "Coal India", "Petróleos Mexicanos", "Russia Coal", 
          "Royal Dutch Shell PLC", "China National Petroleum Corp"
      ];
  
      const emissionsData = [14.3, 4.5, 3.9, 2.3, 2.0, 1.9, 1.9, 1.9, 1.7, 1.6];
  
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#FFC0CB', '#708090', '#77DD77'];
  
      return (<div className="emissions-dashboard">
        <h3>Emissions Overview</h3>
        <p>Your Emissions: {userEmissions.toFixed(2)} kg CO2e</p>
        <p>Average Emissions: {averageEmissions.toFixed(2)} kg CO2e</p>
        <p>Comparison to Average: {comparison.toFixed(1)}%</p>
        <p>{getRecommendations()}</p>
        <div className="feedback-section">
            <h3>Feedback</h3>
            {isLoading ? (
              <p className="loading-feedback">Loading feedback...</p>
            ) : (
              <>
                    <div className="feedback-detail">
                        <h4>Spending Feedback:</h4>
                        <ul>
                            <li>Utilities and transportation have the highest spending categories. Consider reducing utility costs by being more energy-efficient.</li>
                            <li>For transportation, try carpooling, public transportation, or biking to reduce costs and emissions.</li>
                            <li>Buy groceries in bulk and plan meals to reduce waste and costs.</li>
                            <li>Cut down on dining out to save money and reduce packaging waste.</li>
                        </ul>
                    </div>
                    <div className="feedback-detail">
                        <h4>Emission Feedback:</h4>
                        <ul>
                            <li>Gas and transportation are major carbon emitters. Consider greener alternatives for travel and commuting.</li>
                            <li>Invest in energy-efficient electronics to reduce electricity use and emissions.</li>
                            <li>Reduce frequency of eating out to cut down on emissions related to food transport and packaging.</li>
                        </ul>
                    </div>
                    <br></br>
                    <h3>Top Emission Companies</h3>
                    <BarChart labels={companies} dataPoints={emissionsData} color={colors} />
                </>
            )}
        </div>
    </div>
    
      );
  };

  
  const averageEmissions = 7000; // This would be dynamically calculated or fetched in a real app  

  return (
  <div className='dashboard'>
        <div className="header">
            <h2 className="dashboard-title">Dashboard</h2>
        </div>
        <div className="top-row">
        <div className="chart-container">
        <div className="chart-header">
        <h1 className="chart-title">   <span style={{ display: 'inline-block', marginTop: '10px' }}> <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M21.19 7h2.81v15h-21v-5h-2.81v-15h21v5zm1.81 1h-19v13h19v-13zm-9.5 1c3.036 0 5.5 2.464 5.5 5.5s-2.464 5.5-5.5 5.5-5.5-2.464-5.5-5.5 2.464-5.5 5.5-5.5zm0 1c2.484 0 4.5 2.016 4.5 4.5s-2.016 4.5-4.5 4.5-4.5-2.016-4.5-4.5 2.016-4.5 4.5-4.5zm.5 8h-1v-.804c-.767-.16-1.478-.689-1.478-1.704h1.022c0 .591.326.886.978.886.817 0 1.327-.915-.167-1.439-.768-.27-1.68-.676-1.68-1.693 0-.796.573-1.297 1.325-1.448v-.798h1v.806c.704.161 1.313.673 1.313 1.598h-1.018c0-.788-.727-.776-.815-.776-.55 0-.787.291-.787.622 0 .247.134.497.957.768 1.056.344 1.663.845 1.663 1.746 0 .651-.376 1.288-1.313 1.448v.788zm6.19-11v-4h-19v13h1.81v-9h17.19z"/></svg>  </span>  Overview</h1>
            
            <button onClick={() => setShowCO2(!showCO2)} className="chart-toggle-button" style={{ backgroundColor: showCO2 ? costColor : co2Color }}>
                {showCO2 ? 'Cost Data' : 'CO2 Data'}
            </button>
            <div className="button-group">
              <button style={buttonStyle('Month')} onClick={processDataForMonth}>Month</button>
              <button style={buttonStyle('Year')} onClick={processDataForYear}>Year</button>
              <button style={buttonStyle('All')} onClick={processDataForAll}>All</button>
            </div>

        </div>
        <hr />
        <LineChart 
            labels={chartLabels} 
            dataPoints={showCO2 ? chartCO2Points : chartDataPoints} 
            color={showCO2 ? co2Color : costColor}
        />
        <div className="score-container">
            <div className="score financial-score">
                <h2>Financial Score</h2>
                <p className='calcScore'>{financialScore}</p>
                <div className="feedback">{financialFeedback}</div>
            </div>
            <div className="score emission-score">
                <h2>Emission Score</h2>
                <p className='calcScore'>{emissionScore}</p>
                <div className="feedback">{emissionFeedback}</div>
            </div>
        </div>
    </div>


      <div className="month-analysis">
      <h3>Select Month and Year</h3>
        <select value={selectedYear} onChange={handleYearChange} className="select-year">
            {[2019, 2020, 2021, 2022, 2023, 2024].map(year => (
                <option key={year} value={year}>{year}</option>
            ))}
        </select>
        <select value={selectedMonth} onChange={handleMonthChange} className="select-month">
            {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((month, index) => (
                <option key={index} value={month}>{month}</option>
            ))}
        </select>
        <h2>Monthly Statistics</h2>
        <p>Total Spendings: ${monthVal[`${selectedYear}-${selectedMonth}`]?.totalCost.toFixed(2) || '0.00'}</p>
        <div className="progress-bar-container">
            <div className="progress-bar cost-bar" style={{width: `${(monthVal[`${selectedYear}-${selectedMonth}`]?.totalCost / 4423.5 * 100).toFixed(1)}%`}}></div>
        </div>
        <p>Total CO2 Emissions: {monthVal[`${selectedYear}-${selectedMonth}`]?.totalCO2.toFixed(2) || '0.00'} kg CO2e</p>
        <div className="progress-bar-container">
            <div className="progress-bar co2-bar" style={{width: `${(monthVal[`${selectedYear}-${selectedMonth}`]?.totalCO2 / 7000 * 100).toFixed(1)}%`}}></div>
        </div>
        <h2>Categories</h2>
        <PieChart labels={categoryLabels} dataPoints={categoryValues} colors={categoryColors} />
    </div>

        </div>
        <div className="bottom-row">

            <div className="stores-summary">
            <h3 className="stores-summary-title">Stores Summary</h3>
            {displayedStores.length > 0 ? (
                displayedStores.map(([store, details]) => (
                    <div className="store-container" key={store} onClick={() => toggleExpand(store)}>
                        <h4 className="store-title">{store}</h4>
                        <p className="store-details">Total Cost: ${details.totalCost.toFixed(2)}</p>
                        <p className="store-details">Total CO2 Emissions: {details.totalCO2.toFixed(2)} kg CO2e</p>
                        {expandedStore === store && (
                            <ul className="store-items">
                                {details.items.map((item, index) => (
                                    <li key={index}>
                                        {item.name} - ${item.cost.toFixed(2)} - {item.estimated_CO2_emissions}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))
            ) : <p className="loading-text">Loading store data...</p>}
            {Object.entries(storeData).length > 6 && (
                <button className="expand-stores-button" onClick={toggleAllStores}>
                    {showAllStores ? 'Show Less' : 'Show More'}
                </button>
            )}
        </div>
        <EmissionsDashboard userEmissions={monthVal[`${selectedYear}-${selectedMonth}`]?.totalCO2 || 0} averageEmissions={averageEmissions} />
        
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>

);

}

export default Dashboard;
