import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';

import { LocalStorageService } from '../../services/local-storage.service';
import { User } from 'src/app/models/User';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  

  constructor(
    private route: Router,
    private lsService: LocalStorageService,
    private http: HttpService
  ) { }

  user: User;
  private token: string;
  public actualList: string[] = this.lsService.takeFromLocalStorage('list');
  editMode: boolean = false;
  itemTitle: string;
  itemDate: string;
  tmpID: number;
  tmpComplite: boolean;
  
  

 
  ngOnInit() {
    this.redirectToLogin();
    this.user = this.lsService.takeFromLocalStorage('user');
    this.token = this.lsService.takeFromLocalStorage('token');
  }

  getDate(data: Date) {
    let tmp = data.toString().split('T');
    let dateValue = tmp[0];
    let timeValue: string = tmp[1];
    let newDateValue = dateValue.split('-');
    dateValue = newDateValue.join('.');
    let newTimeValue = timeValue.split('.')[0];
    return ` ${dateValue} ${newTimeValue}`
  }

  takeList() {
    this.token = this.lsService.takeFromLocalStorage('token');
    this.http.getList(this.token).subscribe(res => this.lsService.putInLocalStorage('list', res['data']));
  }

  logOut() {
    this.lsService.deletLocalStorage();
    this.redirectToLogin();
  }

  redirectToLogin() {
    if(!this.lsService.takeFromLocalStorage('auth')) {
      this.route.navigate(['']);
    }
  }

  addItem(title: string, expires_at: string) {
    let tmp = expires_at.split('.');
    let data = tmp[0];
    this.http.addTodoItem(this.token, title, data).subscribe(resp => {
      let tmpList = this.lsService.takeFromLocalStorage('list');
      tmpList.push(resp['data']);
      this.lsService.putInLocalStorage('list', tmpList);
      this.actualList = this.lsService.takeFromLocalStorage('list');
      this.itemDate = '';
      this.itemTitle = '';
    });

  }

  removeTodoItem(id: number) {
    this.http.removeTodoItem(this.token, id).subscribe();
    this.actualList = this.lsService.removeTodoItem(id);

  }
  
  applyEditMode(id: number, title: string, expires_at: string, completed: boolean) {
    this.itemTitle = title;
    let tmp = expires_at.split('.');
    let data = tmp[0];
    this.itemDate = data;
    this.editMode = true;
    this.tmpID = id;
    this.tmpComplite = completed;    
  }

  editTodoItem(id: number, title: string, expires_at: string, completed: boolean) {

    this.http.editTodoItem(this.token, id, title, expires_at, completed).subscribe();
    let list = this.lsService.takeFromLocalStorage('list');
    let tmpList = list.map(item => {
      if(item['id'] == id) {
        item['completed'] = completed;
        item['title'] = title;
        item['expires_at'] = expires_at;
        return item;    
      }  else {
        return item;
      }
    });
    this.lsService.putInLocalStorage('list', tmpList);
    this.actualList = this.lsService.takeFromLocalStorage('list');

  }

  editOrAddItem(title: string, expires_at: string) {
    if(this.editMode) {
      this.editTodoItem(this.tmpID, title, expires_at, this.tmpComplite);
      this.cancelEditAdd();
    } else {      
      this.addItem(title, expires_at); 
    }
  }  
  
  cancelEditAdd() {
    this.editMode = false;
    this.itemDate = '';
    this.itemTitle = '';

  }

  toogleComplite(id: number, completed: boolean) {
    this.http.toogleChangeValue(this.token, id, completed).subscribe();
    let list = this.lsService.takeFromLocalStorage('list');
    let tmpList = list.map(item => {
      if(item['id'] == id) {
        item['completed'] = !completed;
        return item;    
      }  else {
        return item;
      }
    });
    this.lsService.putInLocalStorage('list', tmpList);
    this.actualList = this.lsService.takeFromLocalStorage('list');

  }

}
