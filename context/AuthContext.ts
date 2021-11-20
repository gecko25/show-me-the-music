import React from "react";
import SpotifyWebPlayer from "types/spotify-web-player";

export interface IAuthContext {
  accessToken: string;
  refreshToken: string;
  setRefreshToken: (t: string) => void;
  setAccessToken: (t: string) => void;
  currentTrack: SpotifyWebPlayer.Track | undefined;
  setCurrentTrack: (t: SpotifyWebPlayer.Track) => void;
}

const defaultContext: IAuthContext = {
  accessToken: "",
  refreshToken: "",
  setRefreshToken: () => {},
  setAccessToken: () => {},
  currentTrack: undefined,
  setCurrentTrack: () => {},
};

export const AuthContext = React.createContext(defaultContext);

/** Only the provider should use this hook.
 * Everything else should use React.useContext(AuthContext)
 * This hook allows the value of the auth to not be overridden by defaults everytime
 */
export const useAuthContext = (): IAuthContext => {
  const [accessToken, updateAccessToken] = React.useState<string>("");
  const [refreshToken, updateRefreshToken] = React.useState<string>("");
  const [currentTrack, updateCurrentTrack] = React.useState<
    SpotifyWebPlayer.Track | undefined
  >();
  const setAccessToken = React.useCallback((t: string) => {
    updateAccessToken(t);
  }, []);

  const setRefreshToken = React.useCallback((t: string) => {
    updateRefreshToken(t);
  }, []);

  const setCurrentTrack = React.useCallback((t: SpotifyWebPlayer.Track) => {
    updateCurrentTrack(t);
  }, []);

  return {
    accessToken,
    refreshToken,
    setRefreshToken,
    setAccessToken,
    setCurrentTrack,
    currentTrack,
  };
};
