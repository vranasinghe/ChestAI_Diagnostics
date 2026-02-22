import React from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content container">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
