import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-requester-employee-info',
  templateUrl: './requester-employee-info.component.html',
  styleUrls: ['./requester-employee-info.component.css'],
})

export class RequesterEmployeeInfoComponent implements OnInit {

  @Input() portalUserViewModel: any;
  @Input() profilePic: any;
  constructor() { }

  ngOnInit() {
    var acc = document.getElementsByClassName("accordionRequesterInfo");
    var i;
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } 
      });
    }
  }

}
