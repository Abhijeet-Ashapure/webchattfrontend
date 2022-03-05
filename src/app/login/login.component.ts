import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmmitted : boolean = false;
  constructor(private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', Validators.required],
    })
  }

  ngOnInit(): void {
  }

  login(data: any) {
    this.isSubmmitted = true;
    this.userService.authentication(data).subscribe(Response => {
      if (Response.data[0].status == 1) {
        localStorage.setItem('token', Response.data[1].token);
        localStorage.setItem('user_id', Response.data[0]._id);
        localStorage.setItem('userNumber', Response.data[0].userName);
        sessionStorage.setItem('userType', Response.data[0].userType);
        localStorage.setItem('userName', Response.data[0].email);
        localStorage.setItem('user_data', JSON.stringify({ "name": Response.data[0].userName, "email": Response.data[0].email, "role": Response.data.role }));
        this.toastr.success(Response.message, "Success")
        let afterLogin = localStorage.getItem('afterLogin');
        if (afterLogin) {
          location.replace(afterLogin);
        } else {
          this.router.navigate(['./Web-Chat/Chat']);
        }
      } else {
        this.toastr.error(Response.message, "Error");
      }
    }, error => {
      this.toastr.error(error.error.message, 'Error');
    })
  }

}
