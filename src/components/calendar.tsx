import * as React from 'react';
import './calendar.css';
import firebase from 'firebase';


export interface CalendarProps {
  
}
 
export interface CalendarState {
  
}
 
class Calendar extends React.Component<CalendarProps, CalendarState|any> {

  
  constructor(props: any) {
    super(props)

    this.createCalendar = this.createCalendar.bind(this)

    this.state = {
      events: [],
      displayweek: [],
      //Mockup data of a week
      week: [
        {
          name: "Monday",
          date: 25,
          month: "02",
        },
        {
          name: "Tuesday",
          date: 26,
          month: "02"
        },
        {
          name: "Wednesday",
          date: 27,
          month: "02"
        },
        {
          name: "Thursday",
          date: 28,
          month: "02",
        },
        {
          name: "Friday",
          date: 1,
          month: "03",
        },
        {
          name: "Saturday",
          date: 2,
          month: "03",
        },
        {
          name: "Sunday",
          date: 3,
          month: "03",
        }],
    }
    
  }

  componentDidMount() {
    //First fetching the json data for the calendar
    this.importdata()
  }
  
  importdata() {
    fetch("http://www.mocky.io/v2/5c9cdca03300004d003f2151")
      .then(response => response.json())
      .then(json => {
        let i = 0 
        let events = []
        //Parsing the json to a better object
        for (let event of json) {
          events[i] = {startdate: (event.startDate).substring(5,10), 
            starttime: (event.startDate).substring(11,16),
            enddate: (event.endDate).substring(5,10), 
            endtime: (event.endDate).substring(11,16),
            activity: event.activity,
            location: event.location}
          i++;
        }
        //Sets this object as a state
        this.setState({events: events})
        //Then create the actual calendar
        this.createCalendar();
        //Save the json to database
        this.addToDatabase();
      });
      
  }

  createCalendar() {
    let week = [];
    let i = 0;
    let sweek = this.state.week;
    //Builds a day at a time
    while(i!==(sweek).length) {
      //Shorten down the variable for reusability
      let fulldate = `${sweek[i].month}-${sweek[i].date}`
      let todaysevents = []
      //Checking if there are any events for today
      for(let event of this.state.events) {
        if(fulldate===event.startdate || fulldate===event.enddate) {
          //If events are found it gets pushed to a seperate array
          todaysevents.push(event);
        }
      }
      week[i] = 
      <div className="col-sm justify-content-center" key={sweek[i].date}>
        <span>{sweek[i].name} {fulldate.replace("-","/")}</span>
        <ul className="list-groups" key={sweek[i].date}>
          {this.createEvents(todaysevents)}
        </ul>
      </div>
      i++;
    }
    //Displays the current week
    this.setState({displayweek: week})
  }

  createEvents(todaysevents: any) {
    //Sort the events from starttime
    let sortedevents = todaysevents.sort(function(a:any, b:any) {
      return parseFloat(a.starttime) - parseFloat(b.starttime);
    });

    let displayevent = []

    for (let event of sortedevents) {
      //Create the events to be displayed
      displayevent.push(
        <div className="card" key={event.id}>
          <div className="card-body">
            <h5 className="card-title">{event.activity}</h5>
            <p className="card-text">Time: {event.starttime}-{event.endtime}</p>
            <p className="card-text">Location: {event.location}</p>
          </div>
      </div>
      )
    }
    return displayevent
  }

  addToDatabase() {
    var ref = firebase.app().database().ref();
    var usersRef = ref.child("events");
    usersRef.set(this.state.events);
  }

  render() { 

    return (
      <div className="container">
        <div className="row">
          {this.state.displayweek}
        </div>
      </div>
      
      );
  }
}
 
export default Calendar;