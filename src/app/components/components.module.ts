import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from '../material/material.module';
import { TableComponent } from './table/table.component';
import { CreateEditModalComponent } from './create-edit-modal/create-edit-modal.component';



@NgModule({
  declarations: [
    NavbarComponent,
    TableComponent,
    CreateEditModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports:[
    NavbarComponent,
    TableComponent,
    CreateEditModalComponent
  ]
})
export class ComponentsModule { }
