import { Injectable } from '@angular/core';
import * as axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // tslint:disable-next-line: deprecation
  constructor() { }


  envio(data) {
    return axios.default.post('http://localhost:8080/api/user', data);
  }

  enviocredito(data) {
    return axios.default.post('http://localhost:8080/api/credito', data);
  }


}
