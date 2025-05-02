import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from "./layouts/NavBar";
import Register from "./components/register";
import Index from './landing';
import ServiceList from './landing/ServiceList';
import Contact from './landing/Contact';
import HowItWorks from './landing/HowItWorks';
import ServiceDetail from './landing/ServiceDetail';

function App() {
  return (
    <Router>
      <NavBar />
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/Services" element={<ServiceList />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/HowItWorks" element={<HowItWorks />} />
        <Route path="/ServiceDetail" element={<ServiceDetail />} />

      </Routes>
    </Router>
  );
}

export default App;
