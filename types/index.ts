// https://www.songkick.com/developer/response-objects#artist-object
import SpotifyApiTypes from "types/spotify";

export type SongkickEventsResult = {
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
      event: SongkickEvent[];
    };
    status: string;
    totalEntries: number;
  };
};

export type LocationSearchResult = {
  resultsPage: {
    results: {
      location: LocationComplete[];
    };
    totalEntries: number;
    perPage: number;
    page: 1;
    status: string;
  };
};

export type SongkickEventResult = {
  resultsPage: {
    results: {
      event: SongkickEvent[];
    };
    totalEntries: number;
    perPage: number;
    page: 1;
    status: string;
  };
};
export type SongkickEvent = {
  ageRestriction: any;
  displayName: string;
  flaggedAsEnded: boolean;
  id: number;
  location: LocationSimplified;
  performance: Performance[];
  popularity: number;
  start: Start;
  end: Start;
  status: string;
  type: "Concert" | "Festival";
  uri: string;
  venue: VenueSimple;
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
  message: string;
  details?: string;
  status?: string | number;
  statusText?: string;
  json?: object;
};

export type LocationComplete = {
  city: City;
  metroArea: MetroArea;
};

export type LocationSimplified = {
  city: string;
  lat: number;
  lng: number;
};

export type MetroArea = {
  country?: Country;
  displayName: string;
  id?: number;
  state?: State;
  uri?: string;
  lng?: number;
  lat?: number;
};

export type City = {
  uri?: string;
  displayName: string;
  country?: Country;
  id?: number;
  lng?: number;
  lat?: number;
};

export type State = {
  displayName: string;
};

export type Country = {
  displayName: string;
};

export type SongkickArtistIdentifier = {
  mbid: string;
  href: string;
};

export type SongkickArtist = {
  id: number;
  displayName: string;
  uri: string;
  identifier: SongkickArtistIdentifier[];
};

export type UnknownSongkickArtist = {
  displayName: string;
  id?: number;
  uri?: string;
  identifier?: SongkickArtistIdentifier[];
};

export type Start = {
  date: string; // todo make formatted string
  datetime: string;
  time: string;
};

export type Performance = {
  artist: SongkickArtist;
  billing: "headline" | "support";
  billingIndex: number; // 1
  displayName: string;
  id: number;
};

export interface VenueFull extends VenueSimple {
  metroArea: MetroArea;
  city: City;
  zip: string;
  lat: number;
  uri: string;
  displayName: string;
  street: string;
  id: number;
  website: string;
  phone: number;
  capacity: number;
  description: string;
}

export type VenueSimple = {
  id: number;
  displayName: string;
  uri: string;
  lat: number;
  lng: number;
  metroArea: MetroArea;
};

export type ShowMeQueueObject = {
  track: SpotifyApiTypes.TrackObjectFull;
  event: SongkickEvent;
};
