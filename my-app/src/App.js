import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Allchart from './components/chart/Chart';
import Description from './components/chart/Description';
import Prediction from './components/prediction/prediction';
import Weather from './components/chart/Weather';
import Airline from './components/chart/Airline';
import Gaming from './components/chart/Gaming';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/bar" element={<Allchart/>} />
        <Route path="/describe/:category" element={<Description/>} />
        <Route path="/prediction" element={<Prediction/>} />
        <Route path="/chart/weather" element={<Weather/>} />
        <Route path="/chart/airline" element={<Airline/>}/>
        <Route path="/chart/gaming" element={<Gaming/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
