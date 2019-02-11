import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../models/User';
import { HttpService } from '../../services/http.service';
import { LocalStorageService } from '../../services/local-storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private route: Router,
    private httpService: HttpService,
    private lsService: LocalStorageService
    ) { }

  private user: User;
  private loginResp: object;
  private token: string;

  ngOnInit() {
    this.redirectTodoList();
  }

  login(login: string, password: string) {

    this.user = new User(login, password);
    this.httpService.signIn(this.user).subscribe(resp => {
      this.loginResp = resp;
      console.log('login', this.loginResp);
      this.lsService.putInLocalStorage('user', this.loginResp['user']);
      this.lsService.putInLocalStorage('auth', this.loginResp['auth']);
      this.lsService.putInLocalStorage('token', this.loginResp['token']);
      this.takeList();
      
    });
   

  }

  takeList() {
    this.token = this.lsService.takeFromLocalStorage('token');
    this.httpService.getList(this.token).subscribe(res => {this.lsService.putInLocalStorage('list', res['data']); this.redirectTodoList();});
  }

  redirectTodoList() {
    if(this.lsService.takeFromLocalStorage('auth')) {
      this.route.navigate(['todos']);
    }
  }

  goToSignUp() {

    this.route.navigate(['sign-up']) ;

  }
}
