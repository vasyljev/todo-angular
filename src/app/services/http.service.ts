import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  signUp(user: User) {

    this.http.post('https://node--api.herokuapp.com/users/sign_up', user).subscribe(resp => console.log(resp));

  }

  signIn(user: User) {

    return this.http.post('https://node--api.herokuapp.com/users/sign_in', user);
    
  }

  getList(token: string) {

    return this.http.get('https://node--api.herokuapp.com/todos', {
      headers: {'token': token}
    });

  }

  addTodoItem(token: string, title: string, expires_at: string) {

    // let tmp = expires_at.split('T');
    // let arrTmp = tmp.join('T') + ':00';
    console.log('http date', expires_at);
    return this.http.post('https://node--api.herokuapp.com/todos', 
      {
        'title': title,
        'expires_at': new Date (expires_at)
      },
      {
        headers: {
          'token': token
        }
      });

  }

  removeTodoItem(token: string, itemId: number) {

    return this.http.delete(`https://node--api.herokuapp.com/todos/${itemId}`, {
      headers: {'token': token}
    });

  }

  editTodoItem(token: string, itemId: number, title: string, expires_at: string, completed: boolean) {

    return this.http.put(`https://node--api.herokuapp.com/todos/${itemId}`, 
    {
      'completed': completed,
      'title': title,
      'expires_at': expires_at
      
    },
    {
      headers: {'token': token}
    });

  }

  toogleChangeValue(token: string, itemId: number, completed: boolean) {
    return this.http.put(`https://node--api.herokuapp.com/todos/${itemId}`,
    {
      'completed': !completed      
    },
    {
      headers: {'token': token}
    });
  }

}

