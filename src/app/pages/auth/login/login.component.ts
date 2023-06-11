import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/interfaces/login.interface';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageService,
  ){}


  ngOnInit(): void {
    if(this.authService.accesToken){
      this.router.navigate(['/','home']);
    }
    this.constructForm();
  }

  constructForm(){
    this.loginForm = this.fb.group({
      email: [ '', [Validators.required, Validators.email] ],
      password: [ '', Validators.required ],
    });
  }

  doLogin(){

    if(this.loginForm.invalid){
      this.messageService.showMessage('Por favor, llena los campos del formulario');
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email,password).subscribe({
      next: (response:LoginResponse) => {
        if(response.token){
          this.authService.saveToken(response.token);
          this.router.navigate(['home']);
        }
      },
      error: ( error:HttpErrorResponse ) => {
        if(error.error.message){
          this.messageService.showMessage(error.error.message);        
        }else{
          this.messageService.showMessage('Ha ocurrido un error al inciar sesión, vuelva a intentarlo');        
        }
      }
    })


  }

}
