export function getAppointmentsForDay(state, day) {
  let result = [];
  let appointmentId = [];

  const daysArr = state.days;
  const appointments = state.appointments;

  daysArr.forEach(dayObj => {
    dayObj.name === day && appointmentId.push(...dayObj.appointments)
  });

  for (let key in appointments) { 
    appointmentId.includes(appointments[key].id) && result.push(appointments[key])
  }

  return result;
};
