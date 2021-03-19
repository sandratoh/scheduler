// Libraries
import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import DayList from "components/DayList";
import Appointment from "components/Appointment/index";

// Helpers
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

// Style sheets
import "components/Application.scss";

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    axios
      .put(`/api/appointments/${id}`, {interview})
      .then(res => {
        setState({
          ...state,
          appointments
        });
      })
      .catch(err => console.log(err))
  }

  const cancelInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    console.log('appointment', appointment);

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    console.log('appointments', appointments)

    // // axios
    // //   .put(`/api/appointments/${id}`, {interview: null})
    // //   .then(res => {
    // //     setState({
    // //       ...state,
    // //       appointments
    // //     });
    // //     console.log('appointment after promise', appointment)
    // //   })
    // //   .catch(err => console.log(err))

    setState({
      ...state,
      appointments
    })

  };

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }))
    });
  }, [])

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {dailyAppointments.map(appointment => {
          const interview = getInterview(state, appointment.interview);
          return (
            <Appointment
              {...appointment}
              key={appointment.id}
              interview={interview}
              interviewers={dailyInterviewers}
              bookInterview={bookInterview}
              cancelInterview={cancelInterview}
            />
          )
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
