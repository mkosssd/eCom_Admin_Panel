import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
declare const bootstrap: any

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    constructor(private auth: AuthService, private router: Router) { }
    @ViewChild('toastTrigger') toastTrigger: ElementRef
    @ViewChild('toastLiveExample') toastLiveExample: ElementRef

    errorMessage: string = ''
    isError = false
    formOp(authFrom: NgForm) {
        let email = authFrom.value.email;
        let password = authFrom.value.password;
        this.auth.login(email, password).subscribe(res => { },
            errorMessage => {
                this.errorMessage = errorMessage
                this.isError = true
                const toastBootstrap = new bootstrap.Toast(
                    this.toastLiveExample.nativeElement
                )

                toastBootstrap.show()
            }
        )
    }
}
