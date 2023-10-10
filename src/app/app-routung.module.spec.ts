import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes,Router  } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatComponent } from './chat/chat.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { GroupAdminPanelComponent } from './group-admin-panel/group-admin-panel.component';

describe('AppRoutingModule', () => {
  let routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'groupadmin', component: GroupAdminPanelComponent },
    { path: 'superadmin', component: SuperadminComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'chat', component: ChatComponent },
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
    });
  });
  it('should contain a route for login', () => {
    const module = TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
    });

    const router = module.inject(Router);
    expect(router.config).toContain({ path: 'login', component: LoginComponent });
  });

  it('should contain a route for groupadmin', () => {
    const module = TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
    });

    const router = module.inject(Router);
    expect(router.config).toContain({
      path: 'groupadmin',
      component: GroupAdminPanelComponent,
    });
  });

  it('should contain a route for superadmin', () => {
    const module = TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
    });

    const router = module.inject(Router);
    expect(router.config).toContain({
      path: 'superadmin',
      component: SuperadminComponent,
    });
  });

  it('should contain a route for dashboard', () => {
    const module = TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
    });

    const router = module.inject(Router);
    expect(router.config).toContain({
      path: 'dashboard',
      component: DashboardComponent,
    });
  });

  it('should contain a route for profile', () => {
    const module = TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
    });

    const router = module.inject(Router);
    expect(router.config).toContain({
      path: 'profile',
      component: ProfileComponent,
    });
  });

  it('should contain a route for chat', () => {
    const module = TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
    });

    const router = module.inject(Router);
    expect(router.config).toContain({
      path: 'chat',
      component: ChatComponent,
    });
  });
});
