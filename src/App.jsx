import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { CitiesProvider } from './contexts/CitiesContext.jsx';

import Product from './pages/Product/Product';
import Homepage from './pages/Homepage/Homepage';
import Pricing from './pages/Pricing';
import PageNotFound from './pages/PageNotFound';
import Login from './pages/Login/Login';
import AppLayout from './pages/AppLayout/AppLayout';
import CityList from './components/CityList/CityList';
import CountriesList from './components/CountriesList/CountriesList';
import City from './components/City/City';
import Form from './components/Form/Form';

const App = () => {
  return (
    <CitiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/product" element={<Product />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate replace to="cities" />} />
            <Route path="cities" element={<CityList />} />
            <Route path="cities/:id" element={<City />} />
            <Route path="countries" element={<CountriesList />} />
            <Route path="form" element={<Form />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </CitiesProvider>
  );
};

export default App;
