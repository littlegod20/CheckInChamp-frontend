import React from "react";
import { Link } from "react-router-dom";
//  import "../NotFoundPage.css";
 import Navbar from '../Navbar';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <Navbar />
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="btn primary">Go Back to Home</Link>
    </div>
  );
};

export default NotFoundPage;