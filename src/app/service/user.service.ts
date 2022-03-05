import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiURL: string = 'http://18.191.97.1:4000/api/v1/';
  // apiURL: string = 'http://localhost:4000/api/v1/';
  token = localStorage.getItem('token');
  userId = localStorage.getItem('user_id');
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient) { }

  authentication(data:any){
    return this.http.post<any>(this.apiURL + 'userLogin', data, this.httpOptions)
  }

  guestAuthentication(data:any){
    console.log("Guest Service Data :",data)
    return this.http.post<any>(this.apiURL + 'guestLogin', data, this.httpOptions)
  }
  
  changePassword(data:any){
    return this.http.post<any>(this.apiURL + 'change_password', data, this.httpOptions)
  }
  forgotPassword(data:any){
    return this.http.post<any>(this.apiURL + 'userForget', data, this.httpOptions)
  }
  createPassword(data:any){
    return this.http.post<any>(this.apiURL + 'userForgetReset', data, this.httpOptions)
  }
  userRegistration(data:any){
    return this.http.post<any>(this.apiURL + 'userRegister', data, this.httpOptions)
  }
  deleteUser(data:any){
    return this.http.post<any>(this.apiURL + 'deleteUser', data, this.httpOptions)
  }
  userListWithChatHistory(data:any){
    return this.http.post<any>(this.apiURL + 'userListWithChatHistory', data, this.httpOptions)
  }
  getallUsers(){
    return this.http.get<any>(this.apiURL + 'users', this.httpOptions)
  }
}
