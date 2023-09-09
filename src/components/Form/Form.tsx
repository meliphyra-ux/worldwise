import { useEffect, useState, useRef } from 'react';
import { useCities } from '../../contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';
import { useURLPosition } from '../../hooks/useURLPosition';

import { convertToEmoji } from '../../utils/convertToEmoji';

import Message from '../Message/Message';
import Button from '../Button/Button';
import BackButton from '../BackButton/BackButton';
import Spinner from '../Spinner/Spinner';
import DatePicker from 'react-datepicker';

import styles from './Form.module.css';
import 'react-datepicker/dist/react-datepicker.css';

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();
  const { mapLat, mapLng } = useURLPosition();
  const [newCity, setNewCity] = useState({
    cityName: '',
    country: '',
    date: new Date(),
    emoji: '',
  });
  const { cityName, country, date, notes, emoji } = newCity;

  const notesRef = useRef(null);

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState('');

  useEffect(() => {
    async function fetchCityData() {
      if (!mapLat && !mapLng) return;
      setGeocodingError('');
      setIsLoadingGeocoding(true);
      try {
        const res = await fetch(
          `${BASE_URL}?latitude=${mapLat}&longitude=${mapLng}`
        );
        if (!res.ok) throw new Error('Response was not ok');
        const data = await res.json();
        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else 🧐"
          );
        setNewCity((state) => ({
          ...state,
          cityName: data.city || data.locality || '',
          country: data.countryName,
          emoji: convertToEmoji(data.countryCode),
        }));
      } catch (err) {
        setGeocodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
  }, [mapLng, mapLat]);

  function handleNewCityState(e) {
    setNewCity((state) => ({ ...state, [e.target.name]: e.target.value }));
  }
  function handleNewCityDate(date) {
    setNewCity((state) => ({ ...state, date }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat: mapLat,
        lng: mapLng,
      },
    };
    await createCity(newCity);
    navigate('/app/cities');
  }

  if (isLoadingGeocoding) return <Spinner />;
  if (geocodingError) return <Message message={geocodingError} />;
  if (!mapLat && !mapLng) return <Message message="Start by clicking on map" />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          name="cityName"
          onChange={handleNewCityState}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={handleNewCityDate}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea id="notes" name="notes" ref={notesRef} />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
