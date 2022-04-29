import get, { AxiosError } from "axios";

/* Types */
import { SongkickEventsResult, ShowMeError } from "../types";

type eventParams = {
  location: number | undefined;
  location_type: string | null;
  min_date: string | null; // "YYYY-MM-DD"
  max_date: string | null; // "YYYY-MM-DD"
};

type Results = {
  data: SongkickEventsResult;
};

export const getEvents = async (params: eventParams) => {
  try {
    const res: Results = await get("/api/songkick/events", { params });
    if (res.data.resultsPage.totalEntries <= 0) {
      throw new Error(
        "There were no results for this search. </br> Please try a new date or location."
      );
    }

    return res.data;
  } catch (error: any) {
    console.error(error.response);
    if (error.response.data.details === "This apikey has been disabled.") {
      throw new Error("Disabled API");
    }

    if (error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error.message);
  }
};
