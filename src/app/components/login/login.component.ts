import { Component, OnInit } from '@angular/core';
import { FormControl,FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  hide = true;


  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer,private formBuilder: FormBuilder, public UserService: HttpService, private router: Router,private snackbar: MatSnackBar,private sharedService :SharedService  ) {
   
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.required]], 
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  get regFormControls() { 
    return this.registerForm.controls; 
  }

  handelLogin() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    const { email, password } = this.registerForm.value;
    this.UserService.loginUser({ email, password }).subscribe({
      next: (res) => {
        console.log(res);
        this.snackbar.open('Login Successful', '', { duration: 3000 });
        const authResponse = res?.data??res; 
        const username1=authResponse.email;
        console.log(username1)
        const accessExpirationInSeconds = authResponse.accessExpiration;
        console.log('Access Expiration (seconds):', accessExpirationInSeconds);
        const currentTimeInMilliseconds = new Date().getTime();
        const accessExpirationInMilliseconds = currentTimeInMilliseconds + (accessExpirationInSeconds * 1000);
        console.log('Access Expiration (milliseconds):', accessExpirationInMilliseconds);
        sessionStorage.setItem('accessExpiration', accessExpirationInMilliseconds.toString());
        sessionStorage.setItem('username', authResponse?.email?.toString() || '');
        localStorage.setItem('userId', authResponse?.userId?.toString() || '');
        localStorage.setItem('userRole', authResponse?.role?.toString() || '');
        localStorage.setItem('token', authResponse?.jwtToken?.toString() || '');
        this.sharedService.updateLoginStatus(true);
        
            this.router.navigate(['']);
          },
          error: (err) => {
            this.snackbar.open('Login Unsuccessful: invalid credantial', '', {
              duration: 3000,
            });
            console.log(err);
          }
        });
  }
}
