import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserCatalog } from 'src/app/interfaces/userCatalog.interface';
import { MessageService } from 'src/app/services/message-service.service';
import { UserCatalogService } from 'src/app/services/user-catalog.service';

@Component({
  selector: 'app-create-edit-modal',
  templateUrl: './create-edit-modal.component.html',
  styleUrls: ['./create-edit-modal.component.scss']
})
export class CreateEditModalComponent implements OnInit {

  titleLabel: 'Editar registro'| 'Crear registro' = 'Crear registro';
  myForm!: FormGroup;
  userCatalog?: UserCatalog;
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly userCatalogService: UserCatalogService,
    public dialogRef: MatDialogRef<CreateEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: UserCatalog
  ){
    this.data ? this.titleLabel = 'Editar registro' : this.titleLabel = 'Crear registro';
  }


  ngOnInit(): void {
    this.constructForm();
  }

  constructForm(){
    this.myForm = this.fb.group({
      userId: [this.data?.userId || '', Validators.required ],
      userName: [this.data?.userName || '', Validators.required ],
      date: [this.data?.date || '', Validators.required ],
      punchIn: [this.data?.punchIn || '', Validators.required ],
      punchOut: [this.data?.punchOut || '', Validators.required ],
    });
  }


  save(){
    if(this.myForm.invalid){
      this.messageService.showMessage('Favor de llenar todos los campos');
      this.myForm.markAllAsTouched();
      return;
    }
    this.data?._id ? this.update(): this.create();
  }

  create(){
    const{ userId, userName, date, punchIn, punchOut } = this.myForm.value;
    this.userCatalog = ({
      userId: userId,
      userName: userName,
      date: date,
      punchIn: punchIn,
      punchOut: punchOut
    });
    this.userCatalogService.createUserOnCatalog(this.userCatalog!).subscribe({
      next: (response) => {
        this.messageService.showMessage('Registro creado con éxito');
        this.dialogRef.close();
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.showMessage('Ha ocurrido un error al registrar los datos');
      }
    });
  }

  update(){
    this.userCatalog = this.data;
    const{ userId, userName, date, punchIn, punchOut } = this.myForm.value;
    this.userCatalog!.userId = userId;
    this.userCatalog!.userName = userName;
    this.userCatalog!.date = date;
    this.userCatalog!.punchIn = punchIn;
    this.userCatalog!.punchOut = punchOut;

    this.userCatalogService.updateUserOnCatalogById(this.userCatalog!, this.userCatalog!._id!).subscribe({
      next:( response ) => {
        this.dialogRef.close();
        this.messageService.showMessage('Registro actualizado con éxito');
      },
      error: ( error: HttpErrorResponse ) => {
        this.messageService.showMessage('Ha ocurrido un error al actualizar el registro');
      }
    });

  }

  cancel(){
    this.dialogRef.close();
  }

}
