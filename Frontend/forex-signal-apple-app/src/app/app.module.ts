import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularDeviceInformationService } from 'angular-device-information';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashComponent } from './splash/splash.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment.development';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { initializeApp } from "firebase/app";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { PaymentComponent } from './payment/payment.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { NgOtpInputModule } from 'ng-otp-input';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import { DARK_MODE_OPTIONS } from 'angular-dark-mode';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
// import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import {PaymentRequestModule} from '@ng-web-apis/payment-request';




import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { PositionsComponent } from './positions/positions.component';
import { DatePipe } from '@angular/common';
import { AuthGuard } from './authguard.guard';
import { NgxStripeModule } from 'ngx-stripe';
import { AccountInfoComponent } from './account-info/account-info.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PreloaderComponent } from './preloader/preloader.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { HelpSupportComponent } from './help-support/help-support.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { CompoundInterestCalculatorComponent } from './compound-interest-calculator/compound-interest-calculator.component';
import { CarouselComponent } from 'ngx-owl-carousel-o';
import { AppleSigninModule } from 'ngx-apple-signin';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { CoursesComponent } from './courses/courses.component'; // Import the OAuthModule
import { ClipboardModule } from 'ngx-clipboard';
import { IonicModule } from '@ionic/angular';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
// import { VgPlayerModule } from '@videogular/ngx-videogular/player';

// import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    OnboardingComponent,
    LoginComponent,
    SignupComponent,
    OtpVerificationComponent,
    PaymentComponent,
    UserDashboardComponent,
    FooterComponent,
    PositionsComponent,
    AccountInfoComponent,
    EditProfileComponent,
    PreloaderComponent,
    UserHeaderComponent,
    PrivacyPolicyComponent,
    HelpSupportComponent,
    ContactUsComponent,
    TermsConditionComponent,
    CompoundInterestCalculatorComponent,
    CoursesComponent,
    ForgotPasswordComponent,    
  ],
  imports: [
    BrowserAnimationsModule,
    // PaymentRequestModule,
    BrowserModule,
    ClipboardModule,
    OAuthModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
    SocialLoginModule,
    HttpClientModule,
    NgxStripeModule.forRoot(environment.stripe.publicKey),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 2500,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }), // ToastrModule added
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: !isDevMode(),
    //   // Register the ServiceWorker as soon as the application is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:30000'
    // }),
    VgCoreModule,
    VgControlsModule,
    // VgPlayerModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    DatePipe
    // AngularFireModule.initializeApp(environment.firebaseConfig),    
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    
    // AngularFirestoreModule,
    // AngularFireDatabaseModule
  ],
  providers: [
    DatePipe,
    InAppPurchase2,
    OAuthService,
    AuthGuard,
    {provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        // {
        //   id: GoogleLoginProvider.PROVIDER_ID,
        //   oneTapEnabled: false,
        //   provider: new GoogleLoginProvider(
        //     '814500289946-gmvotckg75l09uls4qdpbdrvv2gfrc4n.apps.googleusercontent.com'
        //   )
        // },
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('561602290896109')
        }
      ],
      onError: (err) => {
        console.error(err);
      }
    } as SocialAuthServiceConfig
  },AngularDeviceInformationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
