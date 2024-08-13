import './App.css';
import { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SimGestionMemoria } from './components/modules/SImGestionMemoria';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Fragment>
          <BrowserRouter>
            <Routes>
              <Route exact path='' element={<SimGestionMemoria/>}/>
            </Routes>
          </BrowserRouter>
        </Fragment>
      </header>
    </div>
  );
}

export default App;
