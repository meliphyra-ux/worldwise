import {
  useEffect,
  createContext,
  useContext,
  useCallback,
  useReducer,
} from 'react';

/* ---- API URL ---- */

const BASE_URL = 'http://localhost:8000';

const INITIAL_STATE = {
  cities: [],
  isLoading: false,
  selectedCity: {},
  error: null,
};
/* ---- REDUCER ---- */
function citiesReducer(state, action) {
  switch (action.type) {
    case 'citiesReducer/TOGGLE_LOADING': {
      return {
        ...state,
        isLoading: !state.isLoading,
        error: !state.isLoading ? null : state.error,
      };
    }
    case 'citiesReducer/LOAD_CITIES': {
      return { ...state, cities: action.payload };
    }
    case 'citiesReducer/CREATE_CITY': {
      return { ...state, cities: [...state.cities, action.payload] };
    }
    case 'citiesReducer/DELETE_CITY': {
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    }
    case 'citiesReducer/REQUEST_FAILED': {
      return { ...state, error: action.payload };
    }
    case 'citiesReducer/SELECT_CITY': {
      return { ...state, selectedCity: action.payload };
    }
    default: {
      return state;
    }
  }
}
const toggleLoadingAction = { type: 'citiesReducer/TOGGLE_LOADING' };

/* ---- CONTEXT ---- */

const CitiesContext = createContext(null);

const CitiesProvider = ({ children }) => {
  const [{ cities, isLoading, selectedCity }, dispatch] = useReducer(
    citiesReducer,
    INITIAL_STATE
  );

  const selectCity = useCallback(
    async (id) => {
      if (selectedCity.id === Number(id)) {
        return;
      }
      dispatch(toggleLoadingAction);
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        if (data) {
          dispatch({ type: 'citiesReducer/SELECT_CITY', payload: data });
        }
      } catch (err) {
        dispatch({ type: 'citiesReducer/REQUEST_FAILED', payload: err });
      } finally {
        dispatch(toggleLoadingAction);
      }
    },
    [selectedCity.id]
  );

  const createCity = async (newCity) => {
    dispatch(toggleLoadingAction);
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      dispatch({ type: 'citiesReducer/CREATE_CITY', payload: data });
    } catch (err) {
      dispatch({ type: 'citiesReducer/REQUEST_FAILED', payload: err });
    } finally {
      dispatch(toggleLoadingAction);
    }
  };

  const deleteCity = async (id) => {
    dispatch(toggleLoadingAction);
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      dispatch({
        type: 'citiesReducer/DELETE_CITY',
        payload: id,
      });
    } catch (err) {
      dispatch({ type: 'citiesReducer/REQUEST_FAILED', payload: err });
    } finally {
      dispatch(toggleLoadingAction);
    }
  };

  useEffect(() => {
    async function fetchCities() {
      dispatch(toggleLoadingAction);
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: 'citiesReducer/LOAD_CITIES', payload: data });
      } catch (err) {
        dispatch({ type: 'citiesReducer/REQUEST_FAILED', payload: err });
      } finally {
        dispatch(toggleLoadingAction);
      }
    }
    fetchCities();
  }, []);

  const value = {
    cities,
    isLoading,
    selectedCity,
    selectCity,
    createCity,
    deleteCity,
  };
  return (
    <CitiesContext.Provider value={value}>{children}</CitiesContext.Provider>
  );
};

/* ---- New hook for shortening imports ---- */

const useCities = () => {
  const context = useContext(CitiesContext);
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
