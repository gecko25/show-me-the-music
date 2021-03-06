import type { NextPage } from "next";
import { useState, useContext } from "react";
import { SingleDatePicker } from "react-dates";

/* Context */
import { DateContext } from "@context/DateContext";
import { ViewportContext } from "@context/ViewportContext";

type Props = {
  highlight: boolean;
};

const DatePicker = () => {
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
      numberOfMonths={isMobile ? 12 : 2}
      withFullScreenPortal={isMobile}
      noBorder
    />
  );
};

export default DatePicker;
