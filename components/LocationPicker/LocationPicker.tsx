import { Fragment, useState, useEffect, useContext } from "react";
import get from "axios";
import { useDebounce } from "@hooks/index";

/* Context */
import { LocationContext } from "@context/LocationContext";

/* Utils */
import { formatLocation, formatPlaceholder } from "@utils/helpers";

/* Types */
import { LocationComplete, LocationSearchResult } from "types";

type Props = {
  highlightLocation: boolean;
  clearHighlight: () => void;
};

const LocationPicker = ({ highlightLocation, clearHighlight }: Props) => {
  const { location, setLocation } = useContext(LocationContext);

  /* *******
   * HOOKS *
   ******* */
  const [locationInput, updateLocationInput] = useState<string | undefined>("");
  const [locationList, setLocationList] = useState<LocationComplete[]>([]);
  const debouncedLocationInput = useDebounce(locationInput, 300);
  const [isSearching, setSearchingStatus] = useState(false);
  const [noLocationsFound, setNoLocationsFound] = useState("");
  const [preventSearch, setPreventSearch] = useState(true);

  useEffect(() => {
    updateLocationInput(formatPlaceholder(location?.metroArea?.displayName));
  }, [location?.metroArea?.displayName]);
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
    clearHighlight();
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
    <section id="LocationPicker" className="h-12 relative">
      <input
        type="text"
        id="LocationPicker__input"
        value={locationInput}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        onChange={onChangeHandler}
        className={`${
          highlightLocation ? "animate-pulse-seagreen" : ""
        } absolute text-secondary placeholder-secondary bottom-0 text-5xl m-auto font-bebas-regular`}
        style={{ textDecoration: "underline" }}
      />

      <div className="absolute top-12">
        {isSearching && (
          <div className="text-xl text-secondary opacity-80 font-bebas-regular">
            Loading...
          </div>
        )}

        {!isSearching && locationList.length === 0 && noLocationsFound && (
          <div className="text-xl text-secondary opacity-80 font-bebas-regular">
            {noLocationsFound}
          </div>
        )}

        <div className="absolute z-20 w-64 bg-secondary text-background shadow-xl rounded text-2xl mt-2">
          {!isSearching &&
            locationList.length > 0 &&
            locationList.map((loc: LocationComplete) => (
              <button
                className="block transition transform duration-500 hover:translate-x-1 my-auto cursor-pointer py-py font-bebas-regular px-3 py-1 whitespace-nowrap"
                key={`${loc.metroArea.id}${location?.city.id}`}
                onClick={(e) => updateLocation(e, loc)}
                tabIndex={0}
              >
                {formatLocation(loc)}
              </button>
            ))}
        </div>
      </div>
    </section>
  );
};

export default LocationPicker;
