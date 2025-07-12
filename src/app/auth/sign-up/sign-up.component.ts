import { Component, ElementRef, ViewChild } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
declare const bootstrap: any
@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
    constructor(private auth: AuthService, private router: Router) { }
    @ViewChild('toastTrigger') toastTrigger: ElementRef
    @ViewChild('toastLiveExample') toastLiveExample: ElementRef
    authForm: FormGroup
    confirmPassword = ''
    inputPassword = ''
    ifMatched: boolean = true
    passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/
    isValid = false
    numEx = /^[A-Za-z]+$/
    errorMessage: string = ''
    isError = false
    ngOnInit(): void {
        // this.authForm = new FormGroup({
        //     firstName: new FormControl(null, [Validators.required]),
        //     lastName: new FormControl(null),
        //     email: new FormControl(null, [Validators.required, Validators.email]),
        //     inputPassword: new FormControl(null, [
        //         Validators.required,
        //         Validators.pattern(this.passwordRegex)
        //     ]),
        //     confirmPassword: new FormControl(null, [
        //         Validators.required,
        //         Validators.pattern(this.passwordRegex)
        //     ])
        // })
        this.authForm = new FormGroup({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl(''),
            storeName: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            inputPassword: new FormControl('', [
                Validators.required,
                Validators.pattern(this.passwordRegex)
            ]),
            confirmPassword: new FormControl('', [
                Validators.required,
                Validators.pattern(this.passwordRegex)
            ])
        })
    }

    onSubmit() {
        console.log(this.authForm.value)
        this.auth.signup(this.authForm.value).subscribe({
            next: res => {
                this.router.navigate(['/'])
            },
            error: err => {
                console.log(err);

                this.errorMessage = err
                this.isError = true
                const toastBootstrap = new bootstrap.Toast(
                    this.toastLiveExample.nativeElement
                )

                toastBootstrap.show()
            }
        })
    }

    passwordMatch() {

        if (
            this.authForm.value.confirmPassword === this.authForm.value.inputPassword
        ) {
            this.ifMatched = true
        } else {
            this.ifMatched = false
        }
    }
}
