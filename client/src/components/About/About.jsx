import React from 'react';
import './About.css';

function About() {
    return (
        <div className="about-container">
            <section className="about-section">
                <h2>Inspiration</h2>
                <p>Climate change is a pressing global issue, primarily driven by carbon emissions. While large corporations are major contributors to this crisis, individual actions cumulatively make a significant impact. Recognizing this, GreenSlip was born out of a desire to empower individuals to monitor and manage their carbon footprint through their daily financial decisions. The platform not only aims to raise awareness about carbon emissions but also serves as a versatile tool for those keen on optimizing their financial health. By bridging the gap between ecological responsibility and financial management, GreenSlip provides a dual-purpose solution that encourages a more sustainable and economically savvy lifestyle.</p>
            </section>
            <section className="about-section">
                <h2>What it does</h2>
                <p>GreenSlip revolutionizes how users interact with their finances and environmental impact. Upon registering, users can upload images or PDFs of their shopping receipts and utility bills. Our platform, powered by advanced OCR and AI technologies, extracts detailed information from these documents. Users can then access intuitive dashboards that display their spending patterns alongside associated carbon emissions. This functionality allows users to not only track and manage their expenses but also compare their environmental impact over time—monthly, annually, or across all-time records. By providing these insights, GreenSlip enables users to make informed decisions aimed at reducing their carbon footprint while managing their budget.</p>
            </section>
            <section className="about-section">
                <h2>How we built it</h2>
                <ul>
                    <li>Frontend: Developed with React, our frontend delivers a dynamic and interactive user interface.</li>
                    <li>Backend: Flask serves as our backend framework, handling API requests, data processing, and user management.</li>
                    <li>Data Parsing: We utilize the pdf2image library to convert PDF documents into images, which are then processed using a custom-engineered OpenAI prompt to extract financial data and carbon emission details.</li>
                </ul>
            </section>
            <section className="about-section">
                <h2>Challenges we ran into</h2>
                <p>As a solo developer on this project, time was a significant constraint. Balancing the development of a fully functional frontend and backend, along with integrating complex data parsing and AI components, was challenging. Implementing all the desired features within the limited time frame proved to be difficult, but the progress made was substantial.</p>
            </section>
            <section className="about-section">
                <h2>Accomplishments that we're proud of</h2>
                <ul>
                    <li>Aesthetic and Functional UI: The user interface is not only visually appealing but also user-friendly.</li>
                    <li>Data Visualization: Implementing clean and informative graphs that users can interact with to filter data based on different time frames—such as monthly, yearly, or all-time.</li>
                    <li>Impact Awareness: Enabling users to visualize where their money goes and how it impacts the environment.</li>
                </ul>
            </section>
            <section className="about-section">
                <h2>What we learned</h2>
                <p>Throughout the development of GreenSlip, it was enlightening to learn about the average carbon emissions produced by individuals and the significant impact that reducing these emissions can have on our planet. This project also enhanced my skills in full-stack development, particularly in integrating React with Flask and deploying AI-powered data extraction tools.</p>
            </section>
            <section className="about-section">
                <h2>What's next for GreenSlip</h2>
                <p>- E-Receipt Integration: To further reduce paper waste and the carbon footprint associated with physical receipts, integrating with digital receipt formats is a primary goal.</p>
                <p>- Enhanced Data Insights: We plan to incorporate more detailed analytics and personalized tips on reducing both spending and carbon emissions.</p>
                <p>GreenSlip is more than just a financial tracker; it's a movement towards a sustainable future, empowering individuals to make a difference one transaction at a time. Join us in making every slip count towards a greener planet.</p>
            </section>
        </div>
    );
}

export default About;
