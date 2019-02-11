import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../models/User';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private route: Router,
    private httpService: HttpService) { }

  ngOnInit() {
    
  }

  public user: User;

  goToLogin() {
    this.route.navigate(['']);
  }

  signUpUser(firstName: string, lastName: string, username: string, email: string, password: string) {
    this.user = new User(username, password, firstName, lastName,  email);
    console.log(this.user);
    this.httpService.signUp(this.user);
  }

}
