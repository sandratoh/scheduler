import React from 'react';
import 'components/Appointment/styles.scss';

import Header from 'components/Appointment/Header';
import Empty from 'components/Appointment/Empty';
import Show from 'components/Appointment/Show';
import Form from 'components/Appointment//Form';
import Status from 'components/Appointment/Status';
import Confirm from 'components/Appointment/Confirm';
import Error from 'components/Appointment/Error';
import useVisualMode from 'hooks/useVisualMode';

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";


  const { mode, transition, back } = useVisualMode(
      props.interview ? SHOW : EMPTY
    );

  const handleSave = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    // Promise.resolve(props.bookInterview(props.id, interview))
    // .then(() => transition(SHOW))
    // .catch(err => transition(ERROR_SAVE, true))

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(err => transition(ERROR_SAVE, true))
  };

  const handleDelete = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };

    transition(DELETING, true);

    // Promise.resolve(props.cancelInterview(props.id, interview))
    //   .then(() => transition(EMPTY))
    //   .catch(() => transition(ERROR_DELETE, true))

    props
      .cancelInterview(props.id, interview)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
  };
  
  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={handleSave}
        />
      )}
      {mode === SAVING && <Status message="Saving..." />}
      {mode === DELETING && <Status message="Deleting..." />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onCancel={() => back()}
          onConfirm={handleDelete}
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={handleSave}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Could not save appointment"
          onClose={() => back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Could not delete appointment"
          onClose={() => back()}
        />
      )}
    </article>
  );
}