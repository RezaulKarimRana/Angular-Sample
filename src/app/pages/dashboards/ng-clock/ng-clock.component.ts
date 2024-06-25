import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ng-clock',
  templateUrl: './ng-clock.component.html',
  styleUrls: ['./ng-clock.component.scss']
})
export class NgClockComponent implements OnInit {
  dialLines
  clockEl
  constructor() { }

  ngOnInit() {
    this.dialLines  = document.getElementsByClassName('diallines')
    for (let i = 1; i < 60; i++) {
      this.dialLines[i].style.transform = "rotate(" + 6 * i + "deg)";
    }
    setInterval(this.clock,500);
    setInterval(this.updateSecondArm,1);
  }

  updateSecondArm() {
    const date = new Date();
    const milSec = date.getMilliseconds();
    const sec = date.getSeconds();
    const millSecDeg = (360/(60 * 1000)) * milSec;
    const secDeg = sec * 6;
    const sEl: HTMLElement = document.querySelector('.second-hand');
    sEl.style.transform = "rotate("+(millSecDeg + secDeg)+"deg)";
  }

  clock() {
    let weekday = new Array(7),
      d = new Date(),
      h = d.getHours(),
      m = d.getMinutes(),
      s = d.getSeconds(),
      date = d.getDate(),
      month = d.getMonth() + 1,
      year = d.getFullYear(),
           
      hDeg = h * 30 + m * (360/720),
      mDeg = m * 6 + s * (360/3600),
      
    hEl:HTMLElement = document.querySelector('.hour-hand'),
    mEl: HTMLElement = document.querySelector('.minute-hand'),
    dateEl = document.querySelector('.date'),
    dayEl = document.querySelector('.day');

    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    let day = weekday[d.getDay()];
  
    if(month < 9) {
      month = +("0" + month);
    }
  
    hEl.style.transform = "rotate("+hDeg+"deg)";
    mEl.style.transform = "rotate("+mDeg+"deg)";
    dateEl.innerHTML = date+"/"+month+"/"+year;
    dayEl.innerHTML = day;
  }

}