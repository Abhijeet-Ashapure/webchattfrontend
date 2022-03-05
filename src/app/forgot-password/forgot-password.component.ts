import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private userService: UserService, 
    private fb:FormBuilder, 
    private router:Router, 
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  forgotPassword(email:any){
    if(email == '' || email == undefined){
      this.toastr.error("Please Enter Email", "Error");
      return false;
    }
    let data = {
      "email":email
    }
    this.userService.forgotPassword(data).subscribe(Response =>{
      if(Response.success == true){
        this.toastr.success(Response.message, "Success")
        this.router.navigate(['/Login']);
      }else{
        this.toastr.error(Response.message, "Error")
      }
    },error=>{
      this.toastr.error(error.error.message, 'Error');
    })
  }

}
