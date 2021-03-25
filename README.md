# Interview Scheduler

Interview Scheduler is a React-based single page application that allows users to book, edit, and cancel interviews with a list of mentors. Using a WebSocket server, Interview Scheduler supports multiple users, and all connected users can see schedule updates in their browser in real time.

Visit live application here: [Interview Scheduler](https://605c2355f78cc235b202966b--amazing-davinci-8778df.netlify.app)

## Final Product

### Intuitive and Functional Design

#### **Home Page**
![Scheduler - Home Page](https://github.com/sandratoh/scheduler/blob/master/docs/scheduler-default.png)

#### **Book Interview**
![Scheduler - Book Interview](https://github.com/sandratoh/scheduler/blob/master/docs/scheduler-book.png)

### Mobile-Friendly

#### **Edit Interview**
<img src="https://github.com/sandratoh/scheduler/blob/master/docs/scheduler-edit-mobile.png" alt="Scheduler - Edit Interview (mobile)" height="800" width=auto>

#### **Cancel Confirmation**
<img src="https://github.com/sandratoh/scheduler/blob/master/docs/scheduler-delete-mobile.png" alt="Scheduler - Cancel Confirmation (mobile)" height="800" width=auto>

## Features

* View schedule based on weekdays
* Book interviews from a list of available interviewers
* Cancel an existing interview after confirming decision
* Edit details of an existing interview
* Update spots available upon successful creation/cancellation of an interview

## Dependencies

* axios
* classnames
* normalize.css
* react
* react-dom
* react-scripts

## Getting Started

* Install dependencies with `npm install`.

* Install local API server at [scheduler-api](https://github.com/sandratoh/scheduler-api)

* Run local server with `npm start`
