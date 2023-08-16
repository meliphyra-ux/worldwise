import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      WorldWise
      <Link to="/pricing">Pricing</Link>
    </div>
  );
};

export default Home;
