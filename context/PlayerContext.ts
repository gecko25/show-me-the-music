import React, { useEffect } from "react";
import SpotifyWebPlayer from "types/spotify-web-player";

export interface IPlayerContext {
  player: SpotifyWebPlayer.Player | undefined;
  setPlayer: (p: SpotifyWebPlayer.Player) => void;
  currentTrack: SpotifyWebPlayer.Track | undefined;
  setCurrentTrack: (t: SpotifyWebPlayer.Track) => void;
}

const defaultContext: IPlayerContext = {
  player: undefined,
  setPlayer: () => {},
  currentTrack: undefined,
  setCurrentTrack: () => {},
};

export const PlayerContext = React.createContext(defaultContext);

/** Only the provider should use this hook.
 * Everything else should use React.useContext(PlayerContext)
 * This hook allows the value of the auth to not be overridden by defaults everytime
 */
export const usePlayerContext = (): IPlayerContext => {
  const [player, updatePlayer] = React.useState<
    SpotifyWebPlayer.Player | undefined
  >();
  const [currentTrack, updateCurrentTrack] = React.useState<
    SpotifyWebPlayer.Track | undefined
  >();

  const setCurrentTrack = React.useCallback((t: SpotifyWebPlayer.Track) => {
    updateCurrentTrack(t);
  }, []);

  const setPlayer = React.useCallback((t: SpotifyWebPlayer.Player) => {
    updatePlayer(t);
  }, []);

  useEffect(() => {}, [player]);

  return {
    player,
    setPlayer,
    setCurrentTrack,
    currentTrack,
  };
};
