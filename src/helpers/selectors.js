export default function getAppointmentsForDay(state, day) {
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
