import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message-service.service';
import { UserCatalogService } from 'src/app/services/user-catalog.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly authService: AuthService,
    private readonly userCatalogService: UserCatalogService,
    private readonly messageService: MessageService,
  ){}

  logout(){
    this.authService.logout();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    console.log(file);
    
    const formData = new FormData();
    formData.append('file', file);

    this.userCatalogService.uploadCatalog(formData).subscribe({
      next: (response) =>{ 
        location.reload();
        this.messageService.showMessage('Registros cargados con éxito');
      },
      error: ( error: HttpErrorResponse  ) => {
        if(error.error.message){
          this.messageService.showMessage(error.error.message);        
        }else{
          this.messageService.showMessage('Ha ocurrido un error al inciar sesión, vuelva a intentarlo');        
        }
      }
    })

  }
}
