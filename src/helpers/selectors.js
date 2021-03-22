export function getAppointmentsForDay(state, day) {
  let result = [];
  let appointmentId = [];

  const daysArr = state.days;
  const appointments = state.appointments;

  daysArr.map(dayObj => {
    return dayObj.name === day && appointmentId.push(...dayObj.appointments)
  });

  for (let key in appointments) { 
    appointmentId.includes(appointments[key].id) && result.push(appointments[key])
  }

  return result;
};

export function getInterview(state, interview) {
  if (!interview) {
    return null;
    
  } else {
    const interviewers = state.interviewers;
    const interviewerId = interview.interviewer;
    let result = {};

    for (let interviewer in interviewers) {
      if (interviewers[interviewer].id === interviewerId) {

        result = {
          ...interview,
          interviewer: {...interviewers[interviewer]}
        }

      }
    }
    
    return result;
  }
};

export function getInterviewersForDay(state, day) {
  let result = [];
  let interviewerId = [];

  const daysArr = state.days;
  const interviewers = state.interviewers;

  daysArr.map(dayObj => {
    return dayObj.name === day && interviewerId.push(...dayObj.interviewers)
  });

  for (let key in interviewers) { 
    interviewerId.includes(interviewers[key].id) && result.push(interviewers[key])
  }

  return result;
};

export function isNewAppointment(state, id) {
  const appointments = state.appointments;
  for (let appt in appointments) {
    if (appointments[appt].id === id && appointments[appt].interview === null) {
      return true;
    }
  }
  return false;
}

export function updateSpots(days, id, value) {
  days.forEach(day => {
    if (day.appointments.includes(id)) {
      day.spots = parseInt(day.spots) + value
    }
  })
  return days;
};