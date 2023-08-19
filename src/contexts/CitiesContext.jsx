import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from 'react';

const CitiesContext = createContext(null);

const BASE_URL = 'http://localhost:8000';

const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleSelectCity = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      if (data) {
        setSelectedCity(data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchCities() {
      setIsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.warn(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  const value = {
    cities,
    isLoading,
    selectedCity,
    onSelectCity: handleSelectCity,
  };
  return (
    <CitiesContext.Provider value={value}>{children}</CitiesContext.Provider>
  );
};

const useCities = () => {
  const context = useContext(CitiesContext);
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
