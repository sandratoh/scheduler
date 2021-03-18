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