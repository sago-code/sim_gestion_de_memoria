import { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SimGestionMemoria } from './components/modules/SImGestionMemoria';

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route exact path='' element={<SimGestionMemoria/>}/>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
