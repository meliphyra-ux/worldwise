import CityItem from '../CityItem/CityItem';
import Spinner from '../Spinner/Spinner';
import Message from '../Message/Message';

import styles from './CityList.module.css';

const CityList = ({ cities, isLoading }) => {
  if (isLoading) return <Spinner />;
  return (
    <ul className={styles.cityList}>
      {cities.length > 0 ? (
        cities.map((city) => <CityItem key={city.id} city={city} />)
      ) : (
        <Message message="Add your first city to the list" />
      )}
    </ul>
  );
};

export default CityList;
