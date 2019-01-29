import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
   
  private url = "https://chatapi.edwisor.com";
  private socket;

  constructor(public http:HttpClient) {
    this.socket = io(this.url);
   }

  public verifyUser = () =>{
    return Observable.create((observer)=>{
      this.socket.on('verifyUser',(data)=>{
          observer.next(data);
      });
    });
  }

  public onlineUserList = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('online-user-list',(userList)=>{
        observer.next(userList);
      });
    });
  } 

  public disconnectedSoket = ()=>{
    return Observable.create((observer)=>{
      this.socket.on("disconnect",()=>{
        observer.next();
      });
    });
  }

  public setUser = (authToken)=>{
    this.socket.emit("set-user",authToken);
  }

  private handleError(err: HttpErrorResponse){
    let errorMessage = '';
    if(err.error instanceof Error){
        errorMessage = `An error occurred: ${err.error.message}`;
    }else{
        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }
}
