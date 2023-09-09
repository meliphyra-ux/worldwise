import { useCities } from '../../contexts/CitiesContext';
import CountryItem from '../CountryItem/CountryItem';
import Message from '../Message/Message';
import Spinner from '../Spinner/Spinner';

import styles from './CountriesList.module.css';

const CountriesList = () => {
  const { cities, isLoading } = useCities();
  const countries = Object.values(
    cities.reduce((acc, city) => {
      return {
        ...acc,
        [city.country]: { country: city.country, emoji: city.emoji },
      };
    }, {})
  );

  if (isLoading) return <Spinner />;
  return (
    <ul className={styles.countriesList}>
      {countries.length > 0 ? (
        countries.map((country) => (
          <CountryItem key={country.country} country={country} />
        ))
      ) : (
        <Message message="Add your first city to the list" />
      )}
    </ul>
  );
};

export default CountriesList;
