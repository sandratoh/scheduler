import React from 'react';
import 'components/Appointment/styles.scss';

import Header from 'components/Appointment/Header';
import Empty from 'components/Appointment/Empty';
import Show from 'components/Appointment/Show';
import Form from 'components/Appointment//Form';
import Status from 'components/Appointment/Status';
import useVisualMode from 'hooks/useVisualMode';

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";

  const { mode, transition, back } = useVisualMode(
      props.interview ? SHOW : EMPTY
    );

  const onSave = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    Promise.resolve(props.bookInterview(props.id, interview))
    .then(transition(SHOW))

    // props.bookInterview(props.id, interview)
    // transition(SHOW)

    // props.bookInterview(props.id, interview) && transition(SHOW)
  };

  const onDelete = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };

    transition(DELETING);

    Promise.resolve(props.cancelInterview(props.id, interview))
      .then(transition(EMPTY))
  };
  
  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onDelete={onDelete}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={onSave}
        />
      )}
      {mode === SAVING && <Status message="Saving..." />}
      {mode === DELETING && <Status message="Deleting..." />}
    </article>
  );
}