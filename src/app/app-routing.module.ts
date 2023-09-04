import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatComponent } from './chat/chat.component'; // Import the ChatComponent
import { SuperadminComponent } from './superadmin/superadmin.component'; // Import the ChatComponent
import { GroupAdminPanelComponent } from './group-admin-panel/group-admin-panel.component'; // Update the import statement


const routes: Routes = [{path:'login', component: LoginComponent},{path:'groupadmin', component: GroupAdminPanelComponent},{path:'superadmin', component: SuperadminComponent},{path:'dashboard', component: DashboardComponent},
{path:'profile', component: ProfileComponent},{path:'account', component: AccountComponent},{ path: 'chat', component: ChatComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }
