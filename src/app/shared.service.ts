import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public myUserToken: any;
  public myUser: any;
  public allUser: any;
  public searched: any;

  constructor() { }
}
