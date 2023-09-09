import { Link } from 'react-router-dom';
import styles from './CityItem.module.css';
import { useCities } from '../../contexts/CitiesContext';
import { City } from '@/types/types';
import { FormEvent } from 'react';

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));

const CityItem = ({ city }: { city: City }) => {
  const { selectedCity, deleteCity } = useCities();
  const { cityName, emoji, date, id, position } = city;
  const formatedDate = formatDate(date);

  function handleDeleteCity(e: FormEvent) {
    e.preventDefault();
    deleteCity(id);
  }
  return (
    <li>
      <Link
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        className={`${styles.cityItem} ${
          selectedCity && selectedCity.id === id
            ? styles['cityItem--active']
            : ''
        }`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatedDate}</time>
        <button className={styles.deleteBtn} onClick={handleDeleteCity}>
          &times;
        </button>
      </Link>
    </li>
  );
};

export default CityItem;
