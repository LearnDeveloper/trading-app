import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { LoginComponent } from './demo/login/login.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { AddPositionComponent } from './add-position/add-position.component';
import { ViewPositionComponent } from './view-position/view-position.component';

const routes: Routes = [
 {
  path:"",
  component : LoginComponent
 },
 {
  path:"view-user",
  component : ViewUserComponent
 },
 {
  path:"add-position",
  component : AddPositionComponent
 },
 {
  path:"view-position",
  component : ViewPositionComponent
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
    ]
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
