import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FlowComponent } from './flow/flow.component';
import { ContextMenuModule, ContextMenuService } from 'ngx-contextmenu';
import { BorderColorDirective } from './shared/directives/border-color.directive';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    FlowComponent,
    BorderColorDirective
  ],
  imports     : [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ContextMenuModule
  ],
  providers   : [ContextMenuService],
  bootstrap   : [AppComponent]
})
export class AppModule {
}
