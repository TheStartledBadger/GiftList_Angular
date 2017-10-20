import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { UserpageComponent } from './userpage/userpage.component';

import { RouterModule } from '@angular/router';
import { UserlistComponent } from './userlist/userlist.component';
import { AdminComponent } from './admin/admin.component';



@NgModule({
  declarations: [
    AppComponent,
    FrontpageComponent,
    UserpageComponent,
    UserlistComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'userslist',
        component: UserlistComponent
      },
      {
        path: 'admin',
        component: AdminComponent
      },
      {
        path: 'userpage/:id',
        component: UserpageComponent
      },
      {
        path: '',
        redirectTo: '/userslist',
        pathMatch: 'full'
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
