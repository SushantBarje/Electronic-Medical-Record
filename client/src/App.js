import './App.css';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import {BrowserRouter,Routes, Route, Link} from 'react-router-dom';

const pages = [];
const settings = [];

function App() {
  return (
    <div className="App">
      <div className="app-header">
        <Header pages={pages}  settings={settings}></Header>
      </div>
      <div className="app-body">
      
      </div>
    </div>
  );
}

export default App;
