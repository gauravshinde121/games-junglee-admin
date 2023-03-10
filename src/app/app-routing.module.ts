import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },

  {
    path: '',
    loadChildren: () => import('./features/members/members.module').then((m) => m.MembersModule)
  },

  {
    path: '',
    loadChildren: () => import('./features/book-management/book-management.module').then((m) => m.BookManagementModule)
  },

  {
    path: '',
    loadChildren: () => import('./features/account-statement/account-statement.module').then((m) => m.AccountStatementModule)
  },

  {
    path: '',
    loadChildren: () => import('./features/all-logs/all-logs.module').then((m) => m.AllLogsModule)
  },
  {
    path:'',
    loadChildren:()=>import('./features/surveillance/surveillance.module').then((m)=>m.SurveillanceModule)
  },
  {
    path: '',
    loadChildren: () => import('./features/change-password/change-password.module').then((m) => m.ChangePasswordModule)
  },

  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
