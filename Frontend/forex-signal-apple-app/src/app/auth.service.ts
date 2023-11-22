import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService,private oauthService: OAuthService
    ) {
      this.configureOAuthService();
     }
  isLoggedIn(){
    return !!this.cookieService.get('luid');
  }
  
  private configureOAuthService() {
    this.oauthService.loginUrl = 'https://accounts.google.com/o/oauth2/auth';
    this.oauthService.redirectUri = 'http://localhost:4200';
    this.oauthService.clientId = '814500289946-gmvotckg75l09uls4qdpbdrvv2gfrc4n.apps.googleusercontent.com';
    this.oauthService.scope = 'openid profile email';
    this.oauthService.oidc = true;
    this.oauthService.responseType = 'code';

    
  }

  

  

  login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
  }



  
  getUserDetails() {
    const idTokenData = this.oauthService.getIdentityClaims();
    return idTokenData;
  }
}
