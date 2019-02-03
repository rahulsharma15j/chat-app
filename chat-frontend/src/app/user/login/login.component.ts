import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email:any;
  public password:any;

  constructor(public appService:AppService,
    public router:Router,
    private tostr:ToastrService) { }

  ngOnInit() {
  }

  public goToSignUp:any = ()=>{
    this.router.navigate(['/sign-up']);
  }

  public signinFunction:any = ()=>{
    if(!this.email){
       this.tostr.warning('enter email');
    }else if(!this.password){
       this.tostr.warning('enter password');
    }else{
       let data = {
         email:this.email,
         password:this.password
       }

       this.appService.signinFunction(data)
       .subscribe((apiRespnse)=>{
          if(apiRespnse.status === 200){
             console.log(apiRespnse);
             Cookie.set('authToken',apiRespnse.data.authToken);
             Cookie.set('receiverId',apiRespnse.data.userDetails.userId);
             Cookie.set('receiverName',apiRespnse.data.userDetails.firstName + ' ' + apiRespnse.data.userDetails.lastName);
             this.appService.setUserInfoInLocalStorage(apiRespnse.data.userDetails);
             this.router.navigate(['/chat']);
          }else{
             this.tostr.error(apiRespnse.message);
          }
       },(err)=>{
             this.tostr.error('some error occured');
       });
    }
  }

}
