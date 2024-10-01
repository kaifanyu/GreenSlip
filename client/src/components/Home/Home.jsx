import React from 'react';
import './Home.css';
import receipt1 from './1.png';
import receipt2 from './2.png';
import receipt3 from './3.png';
import receipt4 from './4.png';

import graphExample from './graph.png'; // Path to graph image
import monthExample from './month.png'; // Path to monthly summary image
import recep from './stores.png';

function Home() {
  return (
    <div className="home-container">
      <h1 style={{ fontSize: '40px' }}>Welcome to GreenSlip</h1>
      <p style={{ fontSize: '40px' }}>Track Your Spending, Treasure Our Planet</p>
      <div className="features">
        <div className="feature left-feature">
          <div className='receipt-collection'>
              <img src={receipt1} alt="Receipt Example 1" />
              <img src={receipt2} alt="Receipt Example 2" style={{ width: '70%', maxWidth: '310px' }} />              <img src={receipt3} alt="Receipt Example 3" />
              <img src={receipt4} alt="Receipt Example 4" />
            </div>
          <h2>Parse Your Receipts</h2>
          <p>Just upload your purchase receipts, and our system will automatically extract the total cost and items.</p>
          <img src={recep} alt="Graphical Representation" />

        </div>
        <div className="feature right-feature">
          <img src={graphExample} alt="Graphical Representation" />
          <h2>View Spending Graphs</h2>
          <p>Visualize your spending patterns with detailed graphs.</p>
          <img src={monthExample} alt="Monthly Summary" />
          <h2>Monthly Summary</h2>
          <p>Get a summary of your monthly spending and emissions.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
