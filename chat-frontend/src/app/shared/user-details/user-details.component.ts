import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  
  @Input() userFirstName:any;
  @Input() userLastName:any;
  @Input() userStatus:any;
  @Input() messageRead:any;

  public firstChar:string;

  constructor() { }

  ngOnInit():void {
    this.firstChar = this.userFirstName[0];
  }

}
