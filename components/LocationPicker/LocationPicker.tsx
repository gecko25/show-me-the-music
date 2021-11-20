import { Fragment, useState, useEffect, useContext } from "react";
import get from "axios";
import { useDebounce } from "@hooks/index";

/* Context */
import { LocationContext } from "@context/LocationContext";

/* Types */
import { LocationComplete, LocationSearchResult } from "types";

/* Utils */
import { formatLocation } from "@utils/client-helpers";

/* Styles */
import styles from "./LocationPicker.module.scss";

const LocationPicker = () => {
  const { location, setLocation } = useContext(LocationContext);

  /* *******
   * HOOKS *
   ******* */
  const [locationInput, updateLocationInput] = useState<string | undefined>("");
  const [locationList, setLocationList] = useState<LocationComplete[]>([]);
  const debouncedLocationInput = useDebounce(locationInput, 300);
  const [isSearching, setSearchingStatus] = useState(false);
  const [noLocationsFound, setNoLocationsFound] = useState("");
  const [preventSearch, setPreventSearch] = useState(false);

  /*
   * When a user types something into the input box,
   * get a list of locations.
   */
  useEffect(() => {
    const getLocations = async () => {
      console.log("Suggesting locations..");
      setNoLocationsFound("");
      try {
        const res: { data: LocationSearchResult } = await get(
          "/api/songkick/locations",
          {
            params: {
              query: debouncedLocationInput,
            },
          }
        );
        if (res.data.resultsPage.totalEntries > 0) {
          setLocationList(res.data.resultsPage.results.location.slice(0, 3));
        } else {
          setLocationList([]);
          setNoLocationsFound("No locations found");
        }
        setSearchingStatus(false);
      } catch (err) {
        setLocationList([]);
        setNoLocationsFound(
          "There was an issue finding locations. Please try again."
        );
        setSearchingStatus(false);
      }
    };
    if (debouncedLocationInput.length > 0 && !preventSearch) getLocations();
  }, [debouncedLocationInput, preventSearch]);

  /* When a user leaves the location input */
  const onBlurHandler = () => {
    updateLocationInput(location?.metroArea?.displayName); // lastLocation
  };

  /* Clear location input */
  const onFocusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    updateLocationInput("");
    setLocationList([]);
  };

  /* Clear location input */
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreventSearch(false);
    setSearchingStatus(true);
    updateLocationInput(e.target.value);
  };

  /* Get the events associated with the location the user chose. */
  const updateLocation = async (
    e: React.MouseEvent<HTMLButtonElement>,
    loc: LocationComplete
  ) => {
    setLocation(loc);
    setPreventSearch(true);
    updateLocationInput(loc.metroArea.displayName);
    setLocationList([]);
  };

  return (
    <Fragment>
      <input
        type="text"
        value={locationInput}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        onChange={onChangeHandler}
        placeholder={location?.metroArea.displayName}
        className={styles.LocationPickerInput}
      />

      {isSearching && (
        <div className="ta-center c-light-text mt-10">Loading...</div>
      )}

      {!isSearching && locationList.length === 0 && noLocationsFound && (
        <div className="ta-center c-light-text mt-10">{noLocationsFound}</div>
      )}

      {!isSearching &&
        locationList.length > 0 &&
        locationList.map((loc: LocationComplete) => (
          <button
            className={styles.LocationSuggestion}
            key={`${loc.metroArea.id}${location?.city.id}`}
            onClick={(e) => updateLocation(e, loc)}
            tabIndex={0}
          >
            {formatLocation(loc)}
          </button>
        ))}
    </Fragment>
  );
};

export default LocationPicker;
