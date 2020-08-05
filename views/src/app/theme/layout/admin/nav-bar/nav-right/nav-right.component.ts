import {Component, OnInit} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { CommonserviceService } from 'src/app/service/commonservice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {
  public user: any;
  constructor(public commonService: CommonserviceService, public router: Router, public toastr: ToastrService) { 
    this.user = JSON.parse(localStorage.getItem('user'))
  }

  ngOnInit() { }

  logOut() {
    const actionURL = 'logout';
    this.commonService.getAllCall(actionURL)
    .subscribe(res => {
        localStorage.removeItem('user')
        this.router.navigateByUrl("/auth")
        this.toastr.success('Signout Successfully!');
    })
  }
}