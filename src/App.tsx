import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExperiencePage } from './pages/ExperiencePage';
import { OpportunityPage } from './pages/OpportunityPage';
import { BrandsPage } from './pages/BrandsPage';
import { InvestmentPage } from './pages/InvestmentPage';
import { ContactPage } from './pages/ContactPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#091710] text-[#f2f4ec] font-sans antialiased overflow-x-hidden selection:bg-[#6cb33f] selection:text-white flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/opportunity" element={<OpportunityPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/investment" element={<InvestmentPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
