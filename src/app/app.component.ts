import { Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

  constructor( private router: Router,private bnIdle: BnNgIdleService) {
 
  }
  ngOnInit() {
    // this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
    //   if (isTimedOut) {
    //     localStorage.removeItem('currentUser');
    //     localStorage.removeItem('currentLoginUser');
    //     localStorage.removeItem('currentUserAdvanceApproverList');
    //     this.router.navigate(['/account/login']);
    //   }
    // });
    // document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
  }
}
