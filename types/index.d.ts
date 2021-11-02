import { string } from "prop-types";

export type Event = {
  ageRestriction: any;
  displayName: string;
  flaggedAsEnded: boolean;
  id: number;
  location: Location;
  performance: Performance[];
  popularity: number;
  start: Start;
  status: string;
  type: "Concert" | "Festival";
  uri: string;
  venue: Venue;
};

export type Location = {
  city: string;
  lat: number;
  lng: number;
};

export type MetroArea = {
  country: {
    displayName: string;
  };
  displayName: string;
  id: number;
  state: {
    displayName: string;
  };
  uri: string;
};

export type ArtistIdentifier = {
  mbid: string;
  href: string;
};

export type Artist = {
  id: number;
  displayName: string;
  uri: string;
  identifer: ArtistIdentifier[];
};

export type Start = {
  date: string; // todo make formatted string
  datetime: string;
  time: string;
};

export type Performance = {
  artist: Artist;
  billing: "headline" | "something else";
  billingIndex: number; // 1
  displayName: string;
};

export type Venue = {
  id: number;
  displayName: string;
  uri: string;
  lat: number;
  lng: number;
  metroArea: MetroArea;
};
