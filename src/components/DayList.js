import React from "react";
import DayListItem from "components/DayListItem.js";

export default function DayList(props) {  

  return (
  <ul>
    {props.days.map(day => {
      return <DayListItem 
        {...day}
        key={day.id}
        selected={day.name === props.day}
      />
    })}
  </ul>
  );
}