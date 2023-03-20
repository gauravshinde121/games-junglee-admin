import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/members/members.module').then((m) => m.MembersModule)
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/book-management/book-management.module').then((m) => m.BookManagementModule)
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/account-statement/account-statement.module').then((m) => m.AccountStatementModule)
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/all-logs/all-logs.module').then((m) => m.AllLogsModule)
  },
  {
    path:'',
    canActivate: [AuthGuard],
    loadChildren:()=>import('./features/surveillance/surveillance.module').then((m)=>m.SurveillanceModule)
  },
  {
    path:'',
    canActivate: [AuthGuard],
    loadChildren:()=>import('./features/settings/settings.module').then((m)=>m.SettingsModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/change-password/change-password.module').then((m) => m.ChangePasswordModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/google-authentication/google-authentication.module').then((m) => m.GoogleAuthenticationModule)
  },

  { path: '**', redirectTo: '/member/list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
