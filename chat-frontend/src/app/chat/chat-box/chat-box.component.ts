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
  public pageValue:number = 0;
  public messageText:any;
  public userList:any = [];
  public messageList:any = [];
  public scrollToChatTop:boolean = false;
  public disconnectedSocket: boolean;
  public loadingPreviousChat:boolean = false;

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
    this.getMessageFromAUser();
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
     }else{
       this.messageList = previousData;
       this.toastr.warning('No message available');
     }
     this.loadingPreviousChat = false;
    },(err)=>{
       this.toastr.error('some error occured');
    });
  } 

  public loadEarlierPageOfChat:any = ()=>{
    this.loadingPreviousChat = true;
    this.pageValue++;
    this.scrollToChatTop = true;
    this.getPreviousChatWithAUser();
  }

  public userSelectedToChat:any = (id,name)=>{
    console.log("Setting user as active");
    this.userList.map((user)=>{
        if(user.userId == id){
           user.chatting = true;
        }else{
           user.chatting = false;
        }
    });
    Cookie.set('receiverId',id);
    Cookie.set('receiverName',name);
    this.receiverName = name;
    this.receiverId = id;
    this.messageList = [];
    this.pageValue = 0;
    let chatDetails = {
      userId:this.userInfo.userId,
      senderId:id
    }
    this.socketService.markChatAsSeen(chatDetails);
    this.getPreviousChatWithAUser();
  }

  
  public sendMessageUsingKeypress:any = (event:any)=>{
    if(event.keyCode === 13){
      this.sendMessage();
    }
  }

  public sendMessage:any = () =>{
    if(this.messageText){
       let chatMsgObject = {
         senderName: this.userInfo.firstName + ' ' + this.userInfo.lastName,
         senderId:this.userInfo.userId,
         receiverName:Cookie.get('receiverName'),
         receiverId:Cookie.get('receiverId'),
         message:this.messageText,
         createdOn:new Date()
       }
       console.log(chatMsgObject);
       this.socketService.sendChatMessage(chatMsgObject);
       this.pushToChatWindow(chatMsgObject);
    }else{
      this.toastr.warning('text message can not be empty');
    }
  }

  public pushToChatWindow:any = (data)=>{
    this.messageText = '';
    this.messageList.push(data);
    this.scrollToChatTop = false;
  }

  public getMessageFromAUser:any = ()=>{
    this.socketService.chatByUserId(this.userInfo.userId)
    .subscribe((data)=>{
     (this.receiverId == data.senderId)?this.messageList.push(data):'';
     this.toastr.success(`${data.senderName} says : ${data.message}`);
     this.scrollToChatTop = false;
    });
  }

  public logout:any = ()=>{
    this.appService.logout()
    .subscribe((apiResponse)=>{
       if(apiResponse.status === 200){
          console.log('logout called');
          Cookie.delete('authToken');
          Cookie.delete('receiverId');
          Cookie.delete("receiverName");
          this.socketService.exitSocket();
          this.router.navigate(['/']);
      }else{
          this.toastr.error(apiResponse.message);
      }
    },(err)=>{
       this.toastr.error('some error occured');
    });
  }
}
