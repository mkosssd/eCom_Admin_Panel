import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private auth: AuthService) { }
  isAuth = false;
  userMail : string
  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      if (user) {
        this.isAuth = true;
        this.userMail  = user.email
        
      } else {
        this.isAuth = false;
      }
    });
  }
  logout() {
    this.auth.logout();
  }
}
