import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { UIModule } from '../../shared/ui/ui.module';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing';
import { TranslateModule } from '@ngx-translate/core';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAlertModule,
    UIModule,
    TranslateModule,
    AuthRoutingModule,
    CarouselModule
  ]
})
export class AuthModule { }
