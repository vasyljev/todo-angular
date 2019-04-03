import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  putInLocalStorage(key: string, obj: any) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  takeFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  addTodoItem() {
    
  }

  removeTodoItem(id: number) {
    let tmp = this.takeFromLocalStorage('list');
    let filterList = tmp.filter(item => item['id'] != id);
    this.putInLocalStorage('list', filterList);
    return this.takeFromLocalStorage('list');
  }

  deletLocalStorage() {
    localStorage.clear();
  }

}
