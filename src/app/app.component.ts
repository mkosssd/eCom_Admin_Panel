import { Component, enableProdMode, isDevMode, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { GeneralService } from './services/general.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'eCom';
    constructor(private auth: AuthService, public general: GeneralService) { }
    isLoading: Observable<boolean>;


    ngOnInit(): void {
        enableProdMode()
        console.log(environment.production);
        
        this.auth.autoLogin()
        
    }

}
