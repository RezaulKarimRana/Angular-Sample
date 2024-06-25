import { Component, OnInit, AfterViewInit, Inject, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { EventService } from '../../core/services/event.service';
import { AuthService } from '../../core/services/auth.service';
import { DOCUMENT } from '@angular/common';
import { MenuItem, MenuItemSearchModel } from './menu.model';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { StatusCountViewModel } from 'src/app/core/models/common-model/dashboard.model';
import { MenuItemService } from 'src/app/core/services/MenuItem/menuitem.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordComponent } from 'src/app/pages/change-password/change-password.component';
import { ChangeProfilePicComponent } from 'src/app/pages/change-profilepic/change-profilepic.component';
import { DataService } from 'src/app/core/services/EventEmitter/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BaseService } from 'src/app/core/base/base.service';
@Component({
  selector: 'app-horizontaltopbar',
  templateUrl: './horizontaltopbar.component.html',
  styleUrls: ['./horizontaltopbar.component.scss']
})
export class HorizontaltopbarComponent implements OnInit, AfterViewInit {

  languageFormGroup: FormGroup;
  innerWidth: any;
  element;
  flagvalue;
  countryName;
  valueset;

  menuItems = [];
  portalUserViewModel: PortalUserViewModel;
  statusWiseCountData: StatusCountViewModel[];
  profilePicAsByteArrayAsBase64: any;

  constructor(@Inject(DOCUMENT) private document: any, private router: Router, private eventService: EventService,
    private authservice: AuthService,
    public languageService: LanguageService,
    public _cookiesService: CookieService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private entryFormBuilder: FormBuilder,
    private baseService: BaseService,
    private menuItemService: MenuItemService,
    private dataService: DataService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activateMenu();
      }
    });
  }

  ngOnInit(): void {
    this.languageFormGroup = this.entryFormBuilder.group({
      IsUseEnglish: [true]
    });
    this.innerWidth = window.innerWidth;
    this.element = document.documentElement;
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    this._fetchData();


    if (this.portalUserViewModel.ProfilePicUrl) {
      this.profilePicAsByteArrayAsBase64 = "data:image/png;base64," + this.portalUserViewModel.ProfilePicUrl;
    }
    else {
      this.profilePicAsByteArrayAsBase64 = "assets/images/users/avatar-1.jpg";
    }


    this.dataService.userProfilePicChanged.subscribe(x => {
      let profilepic = JSON.parse(localStorage.getItem('ProfilePicUrl'));
      this.profilePicAsByteArrayAsBase64 = null;
      this.profilePicAsByteArrayAsBase64 = profilepic != null ? "data:image/png;base64," + profilepic : "assets/images/users/avatar-1.jpg";
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  logout() {
    this.authservice.logout();
    this.router.navigate(['/account/login']);
  }
  changePassword() {
    this.modalService.open(ChangePasswordComponent, { size: 'md', backdrop: 'static', keyboard: false });
  }
  showProfile() {
    const modalRef = this.modalService.open(ChangeProfilePicComponent, { size: 'xl', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.aModel = this.portalUserViewModel;
    modalRef.result.then((result) => {
      if (result) {
      }
    }, (reason) => {
    });
  }
  onMenuClick(event) {
    const nextEl = event.target.nextElementSibling;
    if (nextEl) {
      const parentEl = event.target.parentNode;
      if (parentEl) {
        parentEl.classList.remove("show");
      }
      nextEl.classList.toggle("show");
    }
    return false;
  }

  ngAfterViewInit() {
    this.activateMenu();
  }
  _removeAllClass(className) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }
  toggleMenubar() {
    const element = document.getElementById('topnav-menu-content');
    element.classList.toggle('show');
  }

  itemClick(event){
    this.toggleMenubar();
  }
  private activateMenu() {
    const resetParent = (el: any) => {
      const parent = el.parentElement;
      if (parent) {
        parent.classList.remove('active');
      }
    };

    const links = document.getElementsByClassName('side-nav-link-ref');
    
    let matchingMenuItem = null;

    for (let i = 0; i < links.length; i++) {
      resetParent(links[i]);
    }
    
    for (let i = 0; i < links.length; i++) {
      if (location.pathname === links[i]['pathname']) {
        matchingMenuItem = links[i];
        break;
      }
    }

    let parent = matchingMenuItem?.parentElement;
    if (parent) {
      if(this.innerWidth > 900){
        parent?.parentElement?.classList.add('active');
      }
      parent?.classList.add('active');
      const parent2 = parent.parentElement;
      if (parent2 && this.innerWidth > 900) {
        parent2.classList.add('active');
      }
    }
    else {
      for (let i = 0; i < links.length; i++) {
        let pathname = this.getParentString((links[i] as HTMLElement)['text']);
        let currentRouterName = location.pathname.substring(0, this.router.url.lastIndexOf('/'));
        if (pathname == currentRouterName) {
          matchingMenuItem = links[i];
          break;
        }
      }
      parent = matchingMenuItem?.parentElement;

      if (parent)
        parent?.classList.add('active');

    }
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  _fetchData = () => {
    let data = new MenuItemSearchModel({
      PageNumber: 1,
      PageSize: 10000,
    });
    this.menuItemService.GetAllMenu(data).subscribe(
      (res) => {
        if (res) {
          this.menuItems = res;
        }
      },
      (err) => {
      }
    );
  }
  hasItems(item: MenuItem) {
    return item.SubItems !== undefined ? item.SubItems.length > 0 : false;
  }
  getParentString(parentText: string) {
    let parentPath = null;
    if (parentText == " Advance Requisition ") {
      return parentPath = '/advances';
    }
    else if (parentText == " Travel Claims Settlement ") {
      return parentPath = '/outstation';
    }
    else if (parentText == " Bill Settlement ") {
      return parentPath = '/settlement';
    }
    else if (parentText == " Travel Authorization ") {
      return parentPath = '/travelauthorisation';
    }
    return parentPath;
  }
  get isUseEnglishFormControl() {
    return this.languageFormGroup ? this.languageFormGroup.get('IsUseEnglish') : null;
  }
  useLanguage() {
    if(this.isUseEnglishFormControl.value)
    {
      this.translate.use('en');
    }
    else
    {
      this.translate.use('bn');
    }
  }
  showUserManual(){
    this.baseService.downloadUserManual().subscribe(res => {
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(res)
      a.href = objectUrl
      a.download = 'User Manual';
      a.click();
      URL.revokeObjectURL(objectUrl);
    }, err => {
    });
  }
}
