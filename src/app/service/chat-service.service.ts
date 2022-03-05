import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  // apiURL: string = 'http://localhost:4000/api/v1/';
  apiURL: string = 'http://18.191.97.1:4000/api/v1/';
  token = localStorage.getItem('token');
  userId = localStorage.getItem('user_id');
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient) { }

  createChatGroup(data: any) {
    return this.http.post<any>(this.apiURL + 'editGroup', data, this.httpOptions)
  }
  getGroup(data: any) {
    return this.http.post<any>(this.apiURL + 'getGroup', data, this.httpOptions)
  }
  getAllGroup() {
    return this.http.get<any>(this.apiURL + 'getAllGroup', this.httpOptions)
  }
  editChatGroup(data: any) {
    return this.http.post<any>(this.apiURL + 'editGroup', data, this.httpOptions)
  }
  getMessages(data: any) {
    return this.http.post<any>(this.apiURL + 'getMessage', data, this.httpOptions)
  }
  getUserMessages(data: any) {
    return this.http.post<any>(this.apiURL + 'getUserMessage', data, this.httpOptions)
  }
  getGroupMessages(data: any) {
    return this.http.post<any>(this.apiURL + 'getGroupMessage', data, this.httpOptions)
  }
  chatDeleteBySender(data: any) {
    return this.http.post<any>(this.apiURL + 'deleteBySender', data, this.httpOptions)
  }
  chatDeleteByReceiver(data: any) {
    return this.http.post<any>(this.apiURL + 'deleteByReceiver', data, this.httpOptions)
  }
  DeleteConversation(data: any) {
    return this.http.post<any>(this.apiURL + 'deleteConversation', data, this.httpOptions)
  }
  chatHistory(data: any) {
    return this.http.post<any>(this.apiURL + 'chatHistory', data, this.httpOptions)
  }
  chatEnable(data: any) {
    return this.http.post<any>(this.apiURL + 'chatEnable', data, this.httpOptions)
  }
  
  chatDisable(data: any) {
    return this.http.post<any>(this.apiURL + 'chatDisable', data, this.httpOptions)
  }
  readMessage(data: any) {
    return this.http.post<any>(this.apiURL + 'markMessageRead', data, this.httpOptions)
  }
  sendEmail(data: any) {
    return this.http.post<any>(this.apiURL + 'sendEmail', data, this.httpOptions)
  }
  sendEmailForChat(data: any) {
    return this.http.post<any>(this.apiURL + 'sendEmailForChat', data, this.httpOptions)
  }
}
