import moment, { Moment } from "moment";
import React from "react";

export interface IDateContext {
  date: Moment;
  setDate: (d: Moment) => void;
}

const defaultContext: IDateContext = {
  date: moment(),
  setDate: () => {},
};

export default React.createContext(defaultContext);
