import React from 'react';
import { StoreExperience } from '../components/StoreExperience';
import { StoreFormats } from '../components/StoreFormats';
import { CompetitiveAdvantage } from '../components/CompetitiveAdvantage';

export const ExperiencePage: React.FC = () => {
  return (
    <div className="pt-20">
      <StoreExperience />
      <StoreFormats />
      <CompetitiveAdvantage />
    </div>
  );
};
