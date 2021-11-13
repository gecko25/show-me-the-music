import { ShowMeError, SongKickError } from "../types";
import { stringify } from "query-string";
import { AxiosError } from "axios";
// https://axios-http.com/docs/handling_errors

export const handleSongKickError = (error: any): ShowMeError => {
  if (error.isAxiosError) {
    console.log(
      `Failed request to: ${error.config.url}?${stringify(error.config.params)}`
    );
    // console.log(error.response?.data);
    // console.log(error.response);
    // console.log(error.toJSON());

    const axiosError: AxiosError = error;
    // const details: SongKickError = axiosError?.response?.data || null;
    return {
      displayMessage:
        "Oops! Something unxpected happeneded. We cannot load events at this time. Please try again later!",
      // details: details?.resultsPage?.error?.message,
      // status: axiosError?.response?.status,
      // statusText: axiosError?.response?.statusText,
    };
  }

  if (error instanceof Error) {
    console.error(error);
    return {
      displayMessage:
        "Oops! Something unxpected happeneded. We cannot load events at this time. Please try again later!",
      details: error?.message,
    };
  }

  console.error(error);
  return {
    displayMessage:
      "Oops! Something unxpected happeneded. We cannot load events at this time. Please try again later!",
    details,
  };
};
