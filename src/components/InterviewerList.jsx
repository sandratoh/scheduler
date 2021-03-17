import React from "react";
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss";

export default function InterviewerList(props) {

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {props.interviewers.map(value => {
          return <InterviewerListItem
            {...value}
            selected={value.id === props.value}
            setInterviewer={event => props.onChange(value.id)}
          />
        })}
      </ul>
    </section>
  )
}