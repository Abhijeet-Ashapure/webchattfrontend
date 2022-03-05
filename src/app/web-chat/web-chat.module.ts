import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { WebChatRoutingModule } from './web-chat-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../theme/theme.module';
import { lightTheme } from '../theme/light-theme';
import { darkTheme } from '../theme/dark-theme';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    WebChatRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    ThemeModule.forRoot({
      themes: [lightTheme, darkTheme],
      active: 'light'
    }),
  ]
})
export class WebChatModule { }
