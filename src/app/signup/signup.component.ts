import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  title = 'signup';

  constructor(private http: HttpClient, private router: Router) { }
  signup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    repassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    admin: new FormControl(false)
  })
  
  signupform() {
    this.http.get<any>("http://localhost:3000/users").subscribe(res => {
      const user = res.find((a: any) => {
        return a.email === this.signup.value.email
      });
      const passmatch = this.signup.value.password === this.signup.value.repassword;
      if (user) {
        alert("User existes !!!");
        this.signup.reset();
      } else if (!passmatch) {
        alert("Password didn't match !!!");
      } else {
        this.http.post<any>("http://localhost:3000/users", this.signup.value)
          .subscribe(res => {
            alert("Signup Successful");
            this.signup.reset();
            this.router.navigate(['login']);
          }, err => {
            alert("Something went wrong !!!")
          })
      }
    }, err => {
      alert("Something went wrong !!!");
    })

  }

  get name() {
    return this.signup.get(`name`)
  }
  get email() {
    return this.signup.get(`email`)
  }
  get mobile() {
    return this.signup.get(`mobile`)
  }
  get password() {
    return this.signup.get(`password`)
  }
  get repassword() {
    return this.signup.get(`repassword`)
  }
}
