import React from 'react';
import { BrandPortfolio } from '../components/BrandPortfolio';
import { StrategicAlliance } from '../components/StrategicAlliance';

export const BrandsPage: React.FC = () => {
  return (
    <div className="pt-20">
      <BrandPortfolio />
      <StrategicAlliance />
    </div>
  );
};
