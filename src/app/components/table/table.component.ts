import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { tableCarruselImagesColumnsConstant } from 'src/app/constants/constanst';
import { TableColumn } from 'src/app/interfaces/tableColumn.interface';
import { UserCatalog, UserCatalogResponse } from 'src/app/interfaces/userCatalog.interface';
import { MessageService } from 'src/app/services/message-service.service';
import { UserCatalogService } from 'src/app/services/user-catalog.service';
import { CreateEditModalComponent } from '../create-edit-modal/create-edit-modal.component';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, AfterViewInit {

  @ViewChild('table') table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  userCatalogData: UserCatalog[] = [];
  columns: TableColumn[] = tableCarruselImagesColumnsConstant;
  dataSource = new MatTableDataSource<UserCatalog>([]);
  displayedColumns: string[] = [];

  constructor(
    private readonly userCatalogService: UserCatalogService,
    private readonly messageService: MessageService,
    private readonly dialog: MatDialog,
  ){}
  
  ngOnInit(): void {
    this.dataSource.data = [];
    this.displayedColumns = this.columns.map( (column: TableColumn) => column.column );
    console.log(this.displayedColumns)
    this.getData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getData(){
    this.userCatalogService.getAllUsersFromCatalog().subscribe({
      next: (response:UserCatalogResponse) => {
        this.userCatalogData = response.data;
        this.dataSource.data = this.userCatalogData;
      },
      error: (error: Error) => {
        console.error(error);
      }
    })
  }

  createOrUpdate(dataUser?: UserCatalog){
    this.dialog.open( CreateEditModalComponent,{
      data: dataUser,
      width: '400px',
    }).afterClosed().subscribe( result => {
      location.reload();
    } );
  }

  delete(id: string, index: number){
    if(confirm('Desea eliminar el usuario')){
      this.userCatalogService.deleteUserById(id).subscribe({
        next: ( response ) => {
          console.log(response);
          this.userCatalogData.splice(index,1);
          this.table.renderRows(); 
          this.messageService.showMessage('Registro eliminado con éxito');  
        },
        error: ( error: HttpErrorResponse  ) => {
          console.error(error);
          if(error.error.message){
            this.messageService.showMessage(error.error.message);        
          }else{
            this.messageService.showMessage('Ha ocurrido un error al borrar el registro, vuelva a intentarlo');        
          }
        }
      })
    }
  }

}
