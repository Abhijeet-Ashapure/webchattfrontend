import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { AuthGuardService } from '../auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/Chat',
    pathMatch: 'full',
    canActivate: [AuthGuardService]
  },
  { path: 'Chat', component: ChatComponent },
  { path: 'Chat/:id', component: ChatComponent },
  { path: 'GroupChat/:groupId', component: ChatComponent },
  { path: 'Chat/:id/:Username', component: ChatComponent },
  { path: 'Chat/:id/:guestEmail/:userMessage', component: ChatComponent },
  { path: 'Chat/:id/:guestEmail/:inviteEmail', component: ChatComponent },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebChatRoutingModule { }
