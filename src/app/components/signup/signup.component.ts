import { Component, OnInit, } from '@angular/core';
import { FormControl,FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent  implements OnInit {

  registerForm!:any;

  constructor(private formBuilder: FormBuilder,private httpService: HttpService) {
    this.registerForm = this.formBuilder.group({
      fName: new FormControl('', Validators.required),
      lName: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$^&*._-]).{8,}$'),
      ]),
      role: new FormControl('', Validators.required),
    });
  }

  ngOnInit():void{
    
  }

  onSubmit() {
    if(this.registerForm.valid) {
      let {fName, lName, dob, email, password, role} = this.registerForm.value
      dob = this.formatDate(dob);
      this.httpService.addUser({fName, lName,dob,email,password,role}).subscribe(response=>{
      console.log(response);
     }) 
    }
    else{
      console.log('Form is invalid');
    }
  }
  formatDate(date: any): string {
    if (date) {
      const formattedDate = new Date(date);
      const day = String(formattedDate.getDate()).padStart(2, '0');
      const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
      const year = formattedDate.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return '';
  }
}
