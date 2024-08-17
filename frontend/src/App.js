import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Help from './Pages/Help/Help';

function App() {
  return (
    <div >
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/help' element={<Help/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
