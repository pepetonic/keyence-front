export interface UserCatalogResponse {
    message: string;
    data:    UserCatalog[];
}

export interface UserCatalog {
    _id?:      string;
    userId:   string;
    userName: string;
    date:     string;
    punchIn:  string;
    punchOut: string;
    __v?:      number;
}