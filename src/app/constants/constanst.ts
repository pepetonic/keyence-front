import { TableColumn } from "../interfaces/tableColumn.interface";

export const tableCarruselImagesColumnsConstant: TableColumn[] = [ 
    { column: 'userId', label: "UserID", action: false }, 
    { column: 'userName', label: "User Name", action: false  }, 
    { column: 'date', label: "Fecha", action: false  }, 
    { column: 'punchIn', label: "punch In", action: false  }, 
    { column: 'punchOut', label: "punch Out", action: false  }, 
    { column: 'action', label: 'Acciones', action: true }, 
  ]