import React from 'react';
import { MarketOpportunity } from '../components/MarketOpportunity';
import { WhyVillageDeli } from '../components/WhyVillageDeli';
import { WhereWePlay } from '../components/WhereWePlay';

export const OpportunityPage: React.FC = () => {
  return (
    <div className="pt-20">
      <MarketOpportunity />
      <WhyVillageDeli />
      <WhereWePlay />
    </div>
  );
};
