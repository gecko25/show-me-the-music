import { SongkickEvent, SongkickArtist, UnknownSongkickArtist } from "types";

// https://stackoverflow.com/questions/4460586/javascript-regular-expression-to-check-for-ip-addresses
export const isValidIpAddress = (ipaddress: any) => {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ipaddress
  );
};

export const getHeadliners = (evt: SongkickEvent) => {
  let headliners: SongkickArtist[] | UnknownSongkickArtist[];
  try {
    headliners = evt.performance
      .filter((performer) => performer.billing === "headline")
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
