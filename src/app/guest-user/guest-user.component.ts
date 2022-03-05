import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-guest-user',
  templateUrl: './guest-user.component.html',
  styleUrls: ['./guest-user.component.css']
})
export class GuestUserComponent implements OnInit {

  guestLoginForm: FormGroup;
  isSubmmitted : boolean = false;
  constructor(private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.guestLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$")]],
      userName: ['', Validators.required],
    })
  }

  ngOnInit(): void {
  }


  guestLogin(data: any) {
    this.isSubmmitted = true;
    this.userService.userRegistration(data).subscribe(Response => {
      if (Response.success == true) {
        sessionStorage.setItem('user_id', Response.data[0]._id);
        sessionStorage.setItem('userNumber', Response.data[0].userName);
        sessionStorage.setItem('email', Response.data[0].email);
        sessionStorage.setItem('userType', Response.data[0].userType);
        this.toastr.success(Response.message, "Success")
        let afterLogin = localStorage.getItem('afterLogin');
        if (afterLogin) {
          location.replace(afterLogin);
        } else {
          this.router.navigate(['SearchPage']);
        }
      } else {
        this.toastr.error(Response.message, "Error");
        this.router.navigate(['Login']);
      }
    }, error => {
      this.toastr.error(error.error.message, 'Error');
    })
  }
}
