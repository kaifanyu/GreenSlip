import React, { useState, useEffect } from 'react';
import "./NavBar.css";
import { getAuth } from 'firebase/auth';  // Import getAuth from Firebase
import logoImage from './logo.png';  // Path to your logo image

const NavBar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [userEmail, setUserEmail] = useState('');  // State to store the user email
    const auth = getAuth();  // Initialize Firebase auth

    // Function to toggle navbar expansion
    const toggleNavbar = () => {
        setIsExpanded(!isExpanded);
        document.documentElement.style.setProperty('--navbar-width', isExpanded ? '50px' : '15%');
    };

    useEffect(() => {
        // Check if there is a current user and set email
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email);  // Set user email if user is logged in
        }
    }, [auth]);  // Dependency array includes auth to re-run when auth state changes

    const tabs = ['About', 'Login', 'Signup', 'Upload', 'Dashboard'];

    return (
        <div className={`navbar-header ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <button className="toggle-button" onClick={toggleNavbar} style={{ left: isExpanded ? '90px' : '-23px', top: isExpanded ? '170px' : '170px'}}>
                {isExpanded ? '<' : '>'}
            </button>
            {isExpanded && (
                <>
                    <a className="title-button" href="/">
                        <div className="button-container" id="title">
                            <img src={logoImage} alt="GreenSlip Logo" style={{ height: '200px', width: 'auto' }} />  {/* Customize size as needed */}
                        </div>
                    </a>
                    <div className="navbar-container">
                        {tabs.map((entry, index) => (
                            <a className="nav-tab" key={index} href={"/" + entry.replace(/ /g, '')}>
                                <div className="button-container">
                                    {entry}
                                </div>
                            </a>
                        ))}
                        <div className="user-info">
                            {userEmail ? `${userEmail}` : 'Not logged in'}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NavBar;



