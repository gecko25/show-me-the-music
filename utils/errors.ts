import { ShowMeError, SongKickError } from "../types";
import { stringify } from "query-string";
import { AxiosError } from "axios";
// https://axios-http.com/docs/handling_errors

const errorMessages = {
  default:
    "Oops! Something unxpected happened. We cannot load events at this time. Please refresh the page or again later!",
};

export const defaultUnknownError = {
  displayMessage: errorMessages.default,
};

export const handleSongKickError = (error: any): ShowMeError => {
  if (error.isAxiosError) {
    console.log(
      `Failed request to: ${error.config.url}?${stringify(error.config.params)}`
    );
    // console.log(error.response?.data);
    // console.log(error.response);
    // console.log(error.toJSON());

    const axiosError: AxiosError = error;
    const details: SongKickError = axiosError?.response?.data || null;

    const r = {
      displayMessage: errorMessages.default,
      details: details?.resultsPage?.error?.message,
      status: axiosError?.response?.status,
      statusText: axiosError?.response?.statusText,
    };

    console.error(r);
    return r;
  }

  if (error instanceof Error) {
    console.error(error);
    return {
      displayMessage: errorMessages.default,
      details: error?.message,
    };
  }

  console.error(error);
  return defaultUnknownError;
};
