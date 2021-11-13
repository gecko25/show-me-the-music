import type { NextPage } from "next";
import { useState, useContext } from "react";
import { SingleDatePicker } from "react-dates";
import { isMobile } from "@utils/constants";

import moment from "moment";

/* Context */
import { DateContext } from "@context/DateContext";
import { ViewportContext } from "@context/ViewportContext";

type Props = {};

const DatePicker: NextPage = ({}: Props) => {
  const { date, setDate } = useContext(DateContext);
  const { isMobile } = useContext(ViewportContext);

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
      displayFormat="ddd, MMM D"
      orientation={isMobile ? "vertical" : "horizontal"}
      numberOfMonths={isMobile ? 3 : 1}
      withFullScreenPortal={isMobile}
      noBorder
    />
  );
};

export default DatePicker;
