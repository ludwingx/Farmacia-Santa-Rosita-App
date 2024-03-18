export interface IUsers{
    id: string;
    username: string;
    ci: number;    
    name: string;
    email: string,
    password: string;
    image: string;
    role: {
        name: string
    }

}