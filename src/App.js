import {Routes, Route, BrowserRouter} from 'react-router-dom';
import ListadoVentas from './components/ListadoVentas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ListadoVentas></ListadoVentas>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
