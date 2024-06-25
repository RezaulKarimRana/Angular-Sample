import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { PortalUserViewModel } from 'src/app/core/models/auth.models'; 

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.css'],
})

export class EmployeeInfoComponent implements OnInit {
 public portalUserViewModel : PortalUserViewModel;
 constructor() { }

 ngOnInit() {
  this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
  var acc = document.getElementsByClassName("accordionEmployeeInfo");
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
