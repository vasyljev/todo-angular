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
    console.log('tmp list', tmp);
    let filterList = tmp.filter(item => item['id'] != id);
    console.log('tmp filter list', id, filterList);
    this.putInLocalStorage('list', filterList);
    return this.takeFromLocalStorage('list');
  }

  deletLocalStorage() {
    localStorage.clear();
  }

}
