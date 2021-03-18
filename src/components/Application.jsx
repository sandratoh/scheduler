// Libraries
import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import DayList from "components/DayList";
import Appointment from "components/Appointment/index";

// Helpers
import getAppointmentsForDay from "helpers/selectors";

// Style sheets
import "components/Application.scss";

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {}
  });

  const setDay = day => setState({ ...state, day });
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
    ]).then(all => {
      console.log(all);
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data
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
          return <Appointment
            {...appointment}
            key={appointment.id}
          />
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
