import { Component, OnInit } from '@angular/core';
import { CommonserviceService } from 'src/app/service/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
  public email: any;
  public password: any;
  constructor(public commonService: CommonserviceService, private toastr: ToastrService, public router: Router) { }

  ngOnInit() {
    const token = localStorage.getItem('user');
    if (token) {
      this.router.navigateByUrl("/dashboard")
    } 
  }

  doLogin() {
    if (this.email != "" && this.password != "") {
      const actionURL = 'login';
      const sendObj = {
        email: this.email,
        password: this.password
      };
      this.commonService.postCall(actionURL, sendObj)
        .subscribe(res => {
          if (res.login) {
            localStorage.setItem('user', JSON.stringify(res.result.user));
            this.router.navigateByUrl("/dashboard")
            this.toastr.success('Signin Successfully!');
          } else {
            this.toastr.error('Username / Password not valid!','Authentication Failed!');
          }
        })
    } else {
      this.toastr.error('Username / Password not valid!');
    }
  }
}
