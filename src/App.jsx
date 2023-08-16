import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Product from './pages/Product';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import PageNotFound from './pages/PageNotFound';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
