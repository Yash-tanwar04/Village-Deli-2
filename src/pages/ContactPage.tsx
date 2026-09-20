import React from 'react';
import { ContactPartnership } from '../components/ContactPartnership';
import { PartnerOpportunities } from '../components/PartnerOpportunities';

export const ContactPage: React.FC = () => {
  return (
    <div className="pt-20">
      <ContactPartnership />
      <PartnerOpportunities />
    </div>
  );
};
