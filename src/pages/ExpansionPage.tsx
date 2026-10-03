import React from 'react';
import { ExpansionVision } from '../components/ExpansionVision';
import { BrandPromise } from '../components/BrandPromise';

export const ExpansionPage: React.FC = () => {
  return (
    <div className="pt-20">
      <ExpansionVision />
      <BrandPromise />
    </div>
  );
};
