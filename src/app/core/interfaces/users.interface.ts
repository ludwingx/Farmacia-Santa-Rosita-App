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
    role: {
        id: number;
        name: string;
    }

}