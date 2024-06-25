import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgOtpInputModule } from  'ng-otp-input';
import { ExtrapagesRoutingModule } from './extrapages-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CarouselModule,
    ExtrapagesRoutingModule,
    NgOtpInputModule
  ]
})
export class ExtrapagesModule { }
