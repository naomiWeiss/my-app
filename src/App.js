import './App.css';
import React ,{useRef, useState} from 'react';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import Document from './components/Document'
import Instructions from './components/Instructions'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'


export default function App() {
  localStorage.clear();
  let [storedIn, setStoredIn] = useState(JSON.parse(localStorage.getItem('fname')) != null);
  let [fname, setFname] = useState(storedIn ? JSON.parse(localStorage.getItem('fname')) : "");

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={`/`}>
            Personal information
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={'instructions'} className="nav-link">
 | &nbsp;&nbsp; Form instructions                   </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="auth-wrapper">
          <div>
            <Routes>
              <Route path="/" element={ <Navigate to="/document"/>}/>
              <Route path="document" element={<Document fname={fname} storedIn={storedIn}/>} />
              <Route path="instructions" element={<Instructions fname={fname}/>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

