import countries from "world-countries";

const formatCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.official,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));

const useCountries = () => {
  const getAll = () => formatCountries;
  const getValue = (value: string) => {
    return formatCountries.find((item) => item.value === value);
  };
  return {
    getAll,
    getValue,
  };
};
export default useCountries;
