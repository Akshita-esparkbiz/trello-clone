// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from './components/Index';
import './App.css';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/board/:id' element={<MainPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
