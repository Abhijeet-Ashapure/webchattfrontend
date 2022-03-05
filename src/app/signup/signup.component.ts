import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm:FormGroup
  constructor(
    private userService: UserService, 
    private fb:FormBuilder, 
    private router:Router, 
    private toastr: ToastrService
  ) {
    this.signupForm = this.fb.group({
      userName  : ['', Validators.required],
      email     : ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$")]],
      password  : ['', Validators.required],
    })
   }

  ngOnInit(): void {
  }

  UserSignup(data:any){
    console.log(data);
    this.userService.userRegistration(data).subscribe(Response => {
    if(Response.success == true){
          this.toastr.success(Response.message, "Success");
          this.router.navigate(['Login']);
      }else{
      this.toastr.error(Response.message, "Error");
    }
    },error=>{
      this.toastr.error(error.error.message, 'Error');
    })
  }

}
