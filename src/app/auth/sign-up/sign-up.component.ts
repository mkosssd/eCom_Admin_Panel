import { Component, ElementRef, ViewChild } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { AuthService } from '../../services/auth.service'
declare const bootstrap: any
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  constructor (private auth: AuthService) {}
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
  ngOnInit (): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      inputPassword: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.passwordRegex)
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.passwordRegex)
      ])
    })
  }

  onSubmit () {
    //console.log(this.authForm)
    this.auth.signup(this.authForm.value).subscribe(
      res => {},
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

  passwordMatch () {
    
    if (
      this.authForm.value.confirmPassword === this.authForm.value.inputPassword
    ) {
      this.ifMatched = true
    } else {
      this.ifMatched = false
    }
  }
}
