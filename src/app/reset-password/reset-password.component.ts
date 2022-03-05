import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm:FormGroup;
  constructor(
    private userService: UserService, 
    private fb:FormBuilder, 
    private router:Router, 
    private toastr: ToastrService,
    private route: ActivatedRoute) { 
      this.resetPasswordForm = this.fb.group({
        // userId       : '',
        // oldpassword  : ['', Validators.required],
        newpassword  : ['', Validators.required],
        confirmedPassword  : ['', Validators.required],
      })
    }

  ngOnInit(): void {
  }
  resetPassword(formData:any){
    const id = this.route.snapshot.paramMap.get('id');
    if(formData.newpassword !== formData.confirmedPassword){
      this.toastr.error("Confirm password does not match with password", "Error");
      return false;
    }
    let data = {
      // "userId"            : id,
      // "oldpassword"       : formData.oldpassword,
      // "newpassword"       : formData.newpassword,
      // "confirmedPassword" : formData.confirmedPassword,
      "token"             : id,
      "newPassword"       : formData.newpassword,
      "confirmedPassword" : formData.confirmedPassword,

  }
    this.userService.createPassword(data).subscribe(Response =>{
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
