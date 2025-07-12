import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    currentUrl: string;
    isSignUp: boolean;
    isAuth = false;
    userMail: string;
    isLoginRoute: boolean = false

    constructor(private auth: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.auth.user.subscribe({
            next: user => {
                this.isAuth = !!user;
                console.log(user);
                
                this.userMail = user?.storeName;
            },
            error: error => {
                
            }
        });

        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e: NavigationEnd) => {
                this.currentUrl = e.urlAfterRedirects;
                this.isSignUp = e.urlAfterRedirects === '/signup'
                console.log('🔁 Current URL:', this.isSignUp);
            });
    }

    logout() {
        this.auth.logout();
    }
}
