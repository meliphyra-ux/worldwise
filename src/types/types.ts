export type User = {
  name: string;
  email: string;
  password: string;
  avatar: string;
};

export type City = {
  id: number;
  cityName: string;
  country: string;
  emoji: string;
  date: string;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
};

export type ActionWithPayload<T, P> = {
  type: T;
  payload: P;
};
export type Action<T> = {
  type: T;
};
