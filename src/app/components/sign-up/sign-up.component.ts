import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../models/User';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private route: Router,
    private httpService: HttpService,
    private _location: Location) { }

  firstNameSignUp: string;
  lastNameSignUp: string;
  loginSignUp: string;
  emailSignUp: string;
  passwordSignUp: string;

  ngOnInit() {
    
  }

  public user: User;

  goToLogin() {
    this.route.navigate(['']);
  }

  signUpUser(firstName: string, lastName: string, username: string, email: string, password: string) {
    if(firstName && lastName && username && email && password) {
      this.user = new User(username, password, firstName, lastName,  email);
      // console.log(this.user);
      this.httpService.signUp(this.user).subscribe(({message}) => window.alert(message),
      err => {
        err.error.err ? window.alert(`Error: ${err.error.err.errors[0].message}`) : window.alert(`Error: ${err.error.message}`)
        },
      () => {
        console.log('Complite');
        this._location.back();
    });
    } else {
      window.alert('Please, аill in all the fields');
    }
    
  }

}
