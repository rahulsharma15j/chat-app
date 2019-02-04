import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RemoveSpecialCharPipe } from '../shared/remove-special-char/remove-special-char.pipe';

@NgModule({
  declarations: [ChatBoxComponent,RemoveSpecialCharPipe],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      {path:'chat',component:ChatBoxComponent}
    ]),
    SharedModule
  ]
})
export class ChatModule { }
