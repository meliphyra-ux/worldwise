import { Action, ActionWithPayload, City } from '@/types/types';
import {
  useEffect,
  createContext,
  useContext,
  useCallback,
  useReducer,
  ReactNode,
} from 'react';

/* ---- API URL ---- */

const BASE_URL = 'http://localhost:8000';

/* ---- REDUCER ---- */

type CitiesProps = {
  cities: City[];
  isLoading: boolean;
  selectedCity: City | { id: null };
  error: Error | null;
} & (
  | {
      selectCity: (id: number) => Promise<void>;
      createCity: (newCity: City) => Promise<void>;
      deleteCity: (id: number) => Promise<void>;
    }
  | {
      selectCity: () => void;
      createCity: () => void;
      deleteCity: () => void;
    }
);

const INITIAL_STATE: CitiesProps = {
  cities: [],
  isLoading: false,
  selectedCity: { id: null },
  error: null,
  selectCity: () => {},
  createCity: () => {},
  deleteCity: () => {},
};

type CitiesToggleLoading = Action<'citiesReducer/TOGGLE_LOADING'>;
type CitiesLoadCities = ActionWithPayload<'citiesReducer/LOAD_CITIES', City[]>;
type CitiesCreateCity = ActionWithPayload<'citiesReducer/CREATE_CITY', City>;
type CitiesDeleteCity = ActionWithPayload<'citiesReducer/DELETE_CITY', number>;
type CitiesRequestFailed = ActionWithPayload<
  'citiesReducer/REQUEST_FAILED',
  Error
>;
type CitiesSelectCity = ActionWithPayload<'citiesReducer/SELECT_CITY', City>;

type CitiesActions =
  | CitiesCreateCity
  | CitiesDeleteCity
  | CitiesLoadCities
  | CitiesRequestFailed
  | CitiesToggleLoading
  | CitiesSelectCity;

const citiesReducer = (
  state: CitiesProps,
  action: CitiesActions
): CitiesProps => {
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
};
const toggleLoadingAction: CitiesToggleLoading = {
  type: 'citiesReducer/TOGGLE_LOADING',
};

/* ---- CONTEXT ---- */

const CitiesContext = createContext<CitiesProps>(INITIAL_STATE);

const CitiesProvider = ({ children }: { children: ReactNode }) => {
  const [{ cities, isLoading, selectedCity, error }, dispatch] = useReducer(
    citiesReducer,
    INITIAL_STATE
  );

  const selectCity = useCallback(
    async (id: number) => {
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
        dispatch({
          type: 'citiesReducer/REQUEST_FAILED',
          payload: err as Error,
        });
      } finally {
        dispatch(toggleLoadingAction);
      }
    },
    [selectedCity.id]
  );

  const createCity = async (newCity: City) => {
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
      dispatch({ type: 'citiesReducer/REQUEST_FAILED', payload: err as Error });
    } finally {
      dispatch(toggleLoadingAction);
    }
  };

  const deleteCity = async (id: number) => {
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
      dispatch({ type: 'citiesReducer/REQUEST_FAILED', payload: err as Error });
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
        dispatch({
          type: 'citiesReducer/REQUEST_FAILED',
          payload: err as Error,
        });
      } finally {
        dispatch(toggleLoadingAction);
      }
    }
    fetchCities();
  }, []);

  const value = {
    cities,
    isLoading,
    error,
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
