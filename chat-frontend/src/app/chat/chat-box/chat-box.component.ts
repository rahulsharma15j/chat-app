import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers:[SocketService]
})
export class ChatBoxComponent implements OnInit {
  public authToken:any;
  public userInfo:any;
  public receiverId:any;
  public receiverName:any;
  public pageValue:any;
  public userList:any = [];
  public messageList:any = [];
  public disconnectedSocket: boolean;

  constructor(
    public appService:AppService,
    public socketService:SocketService,
    public router:Router,
    private toastr:ToastrService
  ) { 
    this.receiverId = Cookie.get('receiverId');
    this.receiverName = Cookie.get('receiverName');
  }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
  }

  public checkStatus:any = ()=>{
    if(Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null){
       this.router.navigate(['/']);
       return false;
    }else{
       return true;
    }
  }

  public verifyUserConfirmation:any = ()=>{
    this.socketService.verifyUser()
    .subscribe((data)=>{
      this.disconnectedSocket = false;
      this.socketService.setUser(this.authToken);
      this.getOnlineUserList();
    });
  }

  public getOnlineUserList:any = ()=>{
    this.socketService.onlineUserList()
    .subscribe((userList)=>{
      this.userList = [];
      for(let x in userList){
         let temp = {'userId':x,'name':userList[x],'unread':0,'chatting':false};
         this.userList.push(temp);
      }
      console.log(this.userList);
    });
  }

  public getPreviousChatWithAUser:any = () =>{
    let previousData = (this.messageList.length > 0 ? this.messageList.slice():[]);
    this.socketService.getChat(this.userInfo.userId,this.receiverId,this.pageValue * 10)
    .subscribe((apiResponse)=>{
        console.log(apiResponse);
     if(apiResponse.status === 200){
        this.messageList = apiResponse.data.concat(previousData);
     }
    });
  } 
  
}
