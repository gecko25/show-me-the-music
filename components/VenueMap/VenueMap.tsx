import React from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";
// import styles from '../styles/MapStyles'

const QuestionMark = () => <div className="question-mark-marker">?</div>;

type Props = {
  lat: number;
  lng: number;
};

const VenueMap = withScriptjs(
  withGoogleMap((props: Props) => {
    return (
      <GoogleMap
        defaultZoom={15}
        defaultCenter={{ lat: props.lat, lng: props.lng }}
      >
        <Marker position={{ lat: props.lat, lng: props.lng }} />
      </GoogleMap>
    );
  })
);

export default VenueMap;

// To add more redirect links:
// https://console.cloud.google.com/?_ga=2.59625901.1218693277.1637083840-636032946.1637083840
