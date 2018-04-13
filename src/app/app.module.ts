import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FlowComponent } from './flow/flow.component';
import { ContextMenuModule, ContextMenuService } from 'ngx-contextmenu';
import { BorderColorDirective } from './shared/directives/border-color.directive';

@NgModule({
  declarations: [
    AppComponent,
    FlowComponent,
    BorderColorDirective
  ],
  imports     : [
    BrowserModule,
    FormsModule,
    ContextMenuModule
  ],
  providers   : [ContextMenuService],
  bootstrap   : [AppComponent]
})
export class AppModule {
}
