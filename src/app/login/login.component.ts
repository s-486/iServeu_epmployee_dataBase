import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = "loginpage"
  url = "http://localhost:3000/users"
  headerProperty="token"
  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    // if (!!localStorage.getItem('token') && JSON.parse(localStorage.getItem("admin") || "false")) {
    //   this.router.navigate(['dashboardadmin'])
    // } else if(!!localStorage.getItem('token') && !JSON.parse(localStorage.getItem("admin") || "false")) {
    //   this.router.navigate(['dashboard'])
    // } else {
    //   localStorage.removeItem('token')
    //   localStorage.removeItem('admin')
    // }
  }
  login = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  })
  loginform() {
    this.http.get<any>("http://localhost:3000/users")
      .subscribe(res => {
        const user = res.find((a: any) => {
          if(a.email === this.login.value.email && a.password === this.login.value.password && (a.admin == false))
          {
            sessionStorage.setItem('admin',"false")
            return true
          }
          return false
        });
        const admin = res.find((a: any) => {
          if(a.email === this.login.value.email && a.password === this.login.value.password && (a.admin == true))
          {
            sessionStorage.setItem('admin', "true")
            return true
          }
          return false
        });
        if (user) {
          sessionStorage.setItem('token', "hfsiuefbeugfwkfabnfukagfakf")
          this.login.reset();
          this.router.navigate(['user']);
        } else if (admin) {
          sessionStorage.setItem('token', "hfsiuefbeugfwkfabnfukagfakf")
          this.login.reset();
          this.router.navigate(['admin']);
        } else {
          alert("Invalid Credentials !!!");
        }
      }, err => {
        alert("Something went wrong !!!");
      })
  }

  getData() {
    this.http.get(this.url, { observe: 'response' }).subscribe(res => {
      // this.headerProperty = res.headers.get('Authorization');
      console.log(res.headers.get('Authorozation'));
    });
   }
  get email() {
    return this.login.get(`email`)
  }
  get password() {
    return this.login.get(`password`)
  }
}
