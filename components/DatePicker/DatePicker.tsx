import type { NextPage } from "next";
import { useState, useContext } from "react";
import { SingleDatePicker } from "react-dates";
import moment from "moment";

/* Context */
import DateContext from "@context/DateContext";

type Props = {};

const DatePicker: NextPage = ({}: Props) => {
  const { date, setDate } = useContext(DateContext);
  const [focused, setFocus] = useState(false);

  return (
    <SingleDatePicker
      date={date}
      onDateChange={(d) => setDate(d)}
      focused={focused}
      onFocusChange={({ focused }) => {
        setFocus(focused);
      }}
      id="selectedDate"
      numberOfMonths={1}
      displayFormat="ddd, MMM Do"
      noBorder
    />
  );
};

export default DatePicker;
