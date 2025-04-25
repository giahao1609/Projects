// /src/pages/Home.tsx
import React from 'react';
import ProductList from '../components/ProductList';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <ProductList />
    </div>
  );
};

export default Home;
