import {
  SongkickEvent,
  SongkickArtist,
  UnknownSongkickArtist,
  LocationComplete,
} from "types";

// https://stackoverflow.com/questions/4460586/javascript-regular-expression-to-check-for-ip-addresses
export const isValidIpAddress = (ipaddress: any) => {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ipaddress
  );
};

export const getHeadliners = (evt: SongkickEvent) => {
  let headliners: SongkickArtist[];
  try {
    headliners = evt.performance
      .filter((performer) => performer.billing === "headline")
      .map((p) => p.artist);
    return headliners;
  } catch (error) {
    headliners = [
      {
        displayName: evt.displayName,
        id: 0,
        identifier: [],
        uri: "",
      },
    ];
    return headliners;
  }
};

export const getOpeningActs = (evt: SongkickEvent) => {
  let headliners: SongkickArtist[] | UnknownSongkickArtist[];
  try {
    headliners = evt.performance
      .filter((performer) => performer.billing === "support")
      .map((p) => p.artist);
    return headliners;
  } catch (error) {
    headliners = [
      {
        displayName: evt.displayName,
      },
    ];
    return headliners;
  }
};

export const cleanArtistBio = (text: string) => {
  if (
    text ===
    '<a href="https://www.last.fm/music/Feyer">Read more on Last.fm</a>'
  )
    return "";
  if (text.indexOf("<a href=") > 0) {
    const start = text.indexOf("<a href=");
    const end = text.indexOf("</a>");
    return `${text.substring(0, start)}${text.substring(end + 4)}`;
  }

  return text;
};

export const formatLocation = (location: LocationComplete) => {
  const city = location.city.displayName;
  const state = location.metroArea.state?.displayName;
  const country = location.metroArea.country?.displayName;

  if (state) return `${city}, ${state}`;
  return `${city}, ${country}`;
};

// split array into smaller chunks
export const splitIntoChunks = (arr: any[], chunk: number) => {
  let final = [];
  for (let i = 0; i < arr.length; i += chunk) {
    const arrayChunk = arr.slice(i, i + chunk);
    final.push(arrayChunk);
  }

  return final;
};
