import { ReactNode, createContext, useContext, useReducer } from 'react';

import { FAKE_USER } from '../data/fakeUser';
import { Action, ActionWithPayload, User } from '@/types/types';

/* ---- REDUCER ---- */

type LOGIN = ActionWithPayload<'authReducer/USER_LOGGED_IN', User>;
type LOGOUT = Action<'authReducer/USER_LOGGED_OUT'>;

type AuthActions = LOGIN | LOGOUT;

const authReducer = (state: AuthProps, action: AuthActions): AuthProps => {
  switch (action.type) {
    case 'authReducer/USER_LOGGED_IN': {
      return { ...state, user: action.payload, isAuthenticated: true };
    }
    case 'authReducer/USER_LOGGED_OUT': {
      return { ...state, user: null, isAuthenticated: false };
    }
    default: {
      return state;
    }
  }
};
const INITIAL_STATE = {
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
};

type AuthProps = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
};

/* ---- CONTEXT  ---- */

const AuthContext = createContext<AuthProps>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    authReducer,
    INITIAL_STATE
  );

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };
  function login(email: string, password: string) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: 'authReducer/USER_LOGGED_IN', payload: FAKE_USER });
    }
  }
  function logout() {
    dispatch({ type: 'authReducer/USER_LOGGED_OUT' });
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ---- Custom hook for shortening imports  ---- */

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('Auth context was used outside AuthProvider');
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
