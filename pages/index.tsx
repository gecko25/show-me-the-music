import { GetServerSidePropsContext } from "next";
import { stringify } from "query-string";
import { songkick } from "@utils/queries";
import { handleSongKickError } from "@utils/errors";
import { EventsResults, ShowMeError } from "../types";

type Props = {
  data: EventsResults;
  error: ShowMeError;
};

const Page = ({ data, error }: Props) => {
  if (error) {
    console.error(error);
    return <section>{error.displayMessage}</section>;
  }
  return (
    <section>
      {data.resultsPage.results.event.map((evt) => (
        <div key={evt.id}>{evt.displayName}</div>
      ))}
    </section>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const localhostip = "::1";
  const ip = context.req.headers["x-forwarded-for"];

  try {
    const res = await songkick().get<EventsResults>("/events.json", {
      params: {
        location: ip === localhostip ? "clientip" : `ip:${ip}`,
      },
    });

    console.log(
      `GET: ${res.config.baseURL}${res.config.url}?${stringify(
        res.config.params
      )}`
    );

    return {
      props: {
        data: res.data,
      },
    };
  } catch (error) {
    return {
      props: {
        error: handleSongKickError(error),
        data: {},
      },
    };
  }
};

export default Page;

// References
// https://www.saltycrane.com/cheat-sheets/typescript/next.js/latest/
