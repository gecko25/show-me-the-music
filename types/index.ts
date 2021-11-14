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

export type EventsResults = {
  resultsPage: {
    clientLocation: {
      ip: string;
      lat: number;
      lng: number;
      metroAreaId: number;
    };
    page: number;
    perPage: number;
    results: {
      event: Event[];
    };
    status: string;
    totalEntries: number;
  };
};

export type SongKickError = {
  resultsPage: {
    status: string;
    error: {
      message: string;
    };
  };
};

export type ShowMeError = {
  displayMessage: string;
  details?: string;
  status?: string | number;
  statusText?: string;
  json?: object;
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

export type UnknownArtist = {
  displayName: string;
  id?: number;
  uri?: string;
  identifer?: ArtistIdentifier[];
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
