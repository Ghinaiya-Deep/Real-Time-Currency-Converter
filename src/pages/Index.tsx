
import React from 'react';
import CurrencyConverter from '../components/CurrencyConverter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💱 Real-Time Currency Converter
          </h1>
          <p className="text-gray-600 text-lg">
            Convert currencies with live exchange rates from around the world
          </p>
        </div>
        <CurrencyConverter />
      </div>
    </div>
  );
};

export default Index;
