import React from "react";
import DayListItem from "components/DayListItem";

export default function DayList(props) {  

  return (
  <ul>
    {props.days.map(day => {
      return <DayListItem 
        {...day}
        key={day.id}
        selected={day.name === props.day}
        setDay={props.setDay}
      />
    })}
  </ul>
  );
}