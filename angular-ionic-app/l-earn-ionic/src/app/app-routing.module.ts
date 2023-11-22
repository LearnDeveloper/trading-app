import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { PaymentComponent } from './payment/payment.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { PositionsComponent } from './positions/positions.component';
import { AuthGuard } from './authguard.guard';
import { AccountInfoComponent } from './account-info/account-info.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { CoursesComponent } from './courses/courses.component';

const routes: Routes = [
  {
    path: "",
    redirectTo:'signin',
    pathMatch : 'full'
  },
  {
    path: "signin",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
    path: "otp",
    component: OtpVerificationComponent,
  },
  {
    path: "payment",
    component: PaymentComponent ,
    canActivate : [AuthGuard]
  },
  {
    path: "edit-profile",
    component: EditProfileComponent ,
    canActivate : [AuthGuard]
  },
  {
    path: "user-dashboard",
    component: UserDashboardComponent,
    canActivate : [AuthGuard]

  },
  {
    path: "courses",
    component: CoursesComponent,
    canActivate : [AuthGuard]

  },
  {
    path: "privacy",
    component: PrivacyPolicyComponent,
    canActivate : [AuthGuard]

  },
  {
    path: "terms",
    component: TermsConditionComponent,
    canActivate : [AuthGuard]

  },
  {
    path: "contact",
    component: ContactUsComponent,
    canActivate : [AuthGuard]

  },
  {
    path: "account-info",
    component: AccountInfoComponent,
    canActivate : [AuthGuard]

  },
  {
    path: "positions",
    component: PositionsComponent,
    canActivate : [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
