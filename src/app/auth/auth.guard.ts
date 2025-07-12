import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable, map, of, switchMap, take } from 'rxjs'
import { AuthService } from '../services/auth.service';
@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | boolean
        | UrlTree
        | Promise<boolean | UrlTree>
        | Observable<boolean | UrlTree> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                const isAuth = !!user;
                console.log('isAuth', isAuth)
                if (isAuth) {
                 return   this.authService.checkAuthToken().pipe(
                        map((res: any) => {
                            if (res.validUser) {
                                console.log('first')
                                return true;
                            } else {
                                this.authService.logout();
                                return this.router.createUrlTree(['/login']);
                            }
                        })
                    );
                } else {
                    this.authService.logout();
                    return of(this.router.createUrlTree(['/login']));
                }
            })
        )
    }
    
}
