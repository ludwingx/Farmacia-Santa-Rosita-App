export interface IUsers{
    id: number;
    username: string;
    ci: number;    
    name: string;
    email: string,
    password: string;
    image: string;
    status_id : number;
    status: {
        id: number;
        name: string;
    };
    role: Roles;

}
export interface Roles{
    id: number;
    name: string;
}
export interface IAuthUser{
  username: string;
  password: string;
  token: string;
  user: IUsers;
}