import { Component, OnInit,Input } from '@angular/core';
import { LoaderService } from "../../../core/services/loader.service";

@Component({
  selector: 'app-loader-custom',
  templateUrl: './loader-custom.component.html',
  styleUrls: ['./loader-custom.component.scss']
})
export class LoaderCustomComponent implements OnInit {

  @Input() loading: boolean;

  constructor(private loaderService: LoaderService) {

  }
  ngOnInit(): void {
  }

}
