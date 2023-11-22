import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { LoginComponent } from './demo/login/login.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { AddPositionComponent } from './add-position/add-position.component';
import { ViewPositionComponent } from './view-position/view-position.component';
import { AddVideosComponent } from './add-videos/add-videos.component';
import { ViewVideosComponent } from './view-videos/view-videos.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { ViewPaymentComponent } from './view-payment/view-payment.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
 {
  path:"",
  component : LoginComponent
 },
 {
  path:"view-user",
  component : ViewUserComponent,
  canActivate : [AuthGuard]
 },
 {
  path:"add-position",
  component : AddPositionComponent,
  canActivate : [AuthGuard]
 },
 {
  path:"view-position",
  component : ViewPositionComponent,
  canActivate : [AuthGuard]
 },

 {
  path:"add-videos",
  component : AddVideosComponent,
  canActivate : [AuthGuard]
 },
 {
  path:"view-videos",
  component : ViewVideosComponent,
  canActivate : [AuthGuard]
 },
 {
  path:"add-payments",
  component : AddPaymentComponent,
  canActivate : [AuthGuard]
 },
 {
  path:"view-payments",
  component : ViewPaymentComponent,
  canActivate : [AuthGuard]
 },
 {
  path:"edit-payments",
  component : EditPaymentComponent,
  canActivate : [AuthGuard]
 },
 
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: '/login',
      //   pathMatch: 'full'
      // },
      // {
      //   path: 'login',
      //   loadComponent: () => import('./demo/login/login.component')
      // },
      {
        path: 'default',
        loadComponent: () => import('./demo/default/default.component')
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/elements/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/elements/element-color/element-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      }
    ],
    canActivate : [AuthGuard]
  },
  // {
  //   path: '',
  //   component: GuestComponent,
  //   children: [
  //     {
  //       path: 'guest',
  //       loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
  //     }
  //   ]
  // },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
