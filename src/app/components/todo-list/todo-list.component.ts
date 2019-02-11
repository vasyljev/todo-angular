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
export class TodoListComponent implements OnInit, OnChanges {

  

  constructor(
    private route: Router,
    private lsService: LocalStorageService,
    private http: HttpService
  ) { }

  private user: User;
  private token: string;
  public actualList: string[] = this.lsService.takeFromLocalStorage('list');
  editMode: boolean = false;
  itemTitle: string;
  itemDate: string;
  tmpID: number;
  tmpComplite: boolean;
  

  ngOnChanges() {
    console.log('Change');
  }

  ngOnInit() {
    this.redirectToLogin();
    this.user = this.lsService.takeFromLocalStorage('user');
    console.log(this.user);
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
    console.log('expires_at add', expires_at);
    let tmp = expires_at.split('.');
    let data = tmp[0];
    this.http.addTodoItem(this.token, title, data).subscribe(resp => {
      console.log(resp);
      let tmpList = this.lsService.takeFromLocalStorage('list');
      tmpList.push(resp['data']);
      this.lsService.putInLocalStorage('list', tmpList);
      console.log(tmpList);
      this.actualList = this.lsService.takeFromLocalStorage('list');
      this.itemDate = '';
      this.itemTitle = '';
    });

  }

  removeTodoItem(id: number) {

    console.log('id', id);
    this.http.removeTodoItem(this.token, id).subscribe(resp => console.log(resp));
    this.actualList = this.lsService.removeTodoItem(id);

  }
  
  applyEditMode(id: number, title: string, expires_at: string, completed: boolean) {

    this.itemTitle = title;
    let tmp = expires_at.split('.');
    let data = tmp[0];
    this.itemDate = data;
    console.log('this.itemDate apply edit mode', this.itemDate);
    this.editMode = true;
    this.tmpID = id;
    this.tmpComplite = completed;
    
  }

  editTodoItem(id: number, title: string, expires_at: string, completed: boolean) {

    this.http.editTodoItem(this.token, id, title, expires_at, completed).subscribe(resp => console.log(resp));
    let list = this.lsService.takeFromLocalStorage('list');
    let tmpList = list.map(item => {
      if(item['id'] == id) {
        item['completed'] = completed;
        item['title'] = title;
        item['expires_at'] = expires_at;
        console.log('expires_at edit todo', expires_at);
        return item;    
      }  else {
        return item;
      }
    });
    this.lsService.putInLocalStorage('list', tmpList);
    this.actualList = this.lsService.takeFromLocalStorage('list');

  }

  editOrAddItem(title: string, expires_at: string) {
    console.log('expires_at edit or cr', expires_at);
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

    this.http.toogleChangeValue(this.token, id, completed).subscribe(resp=> console.log(resp));
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
