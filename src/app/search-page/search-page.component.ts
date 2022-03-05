import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery'
import { ToastrService } from 'ngx-toastr';
import { ChatServiceService } from '../service/chat-service.service';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  allUser: any = [];
  searchUser: any;
  showInvite: boolean = true;
  userId = sessionStorage.getItem('user_id') ? sessionStorage.getItem('user_id') : localStorage.getItem('user_id');
  userData = sessionStorage.getItem('userNumber') ? sessionStorage.getItem('userNumber') : localStorage.getItem('userNumber');
  showUserList: any = [];
  userType = sessionStorage.getItem('userType');
  constructor(private userService: UserService, private toastr: ToastrService,
    private chatService: ChatServiceService, private router: Router) { }

  ngOnInit(): void {


    $("#search").focusin(function () {
      $("#Modal").show();
    });

    $("#close").click(function () {
      $('#Modal').hide();
    })
    this.getUser();
  }


  getUser() {
    this.userService.getallUsers().subscribe(Response => {
      this.allUser = Response.data
      console.log(Response.data)
    })
  }

  checkUserExist() {
    this.showInvite = true;
    console.log(this.searchUser);
    let user = this.allUser.findIndex((x: any) => (x.email == this.searchUser));
    console.log(user);
    if (user < 0) {
      this.showInvite = true;
    } else {
      let userData = this.allUser.filter((x: any) => (x.email == this.searchUser));
      this.showUserList = userData;
      this.showInvite = false;
    }

  }

  sendEmailToInvite(email: any) {
    if (email == null || email == '') {
      this.toastr.error('Please Enter Email', 'Error')
      return false
    }
    if (email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")) {
      let data = {
        email: email,
        userName: this.userData,
        userId: this.userId
      }
      this.chatService.sendEmail(data).subscribe(Response => {
        console.log(Response)
        this.toastr.success(`Mail has been sent to the ${email}`, 'Success')
      })
    } else {
      this.toastr.error('Please Enter valid Email', 'Error')
      return false
    }

  }

  sendInvite(email: any) {
    if (email == null || email == '') {
      this.toastr.error('Please Enter Email', 'Error')
      return false
    }
    if (email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")) {
      this.router.navigate(['/Web-Chat/Chat', { inviteEmail: email }])
    } else {
      this.toastr.error('Please Enter valid Email', 'Error')
      return false
    }
  }
}
