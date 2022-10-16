import {pool} from "../database";


interface AdminRecordType {
    id: string;
    login: string;
    password: string;
}


export class AdminRecord {
    id: string;
    login: string;
    password: string;

    constructor (adminRecordObject: AdminRecordType) {
        this.id = adminRecordObject.id;
        this.login = adminRecordObject.login;
        this.password = adminRecordObject.password;
    }

    static async arePassesCorrect (login: string, password: string) {
        try {
            const [results]
                = await pool.execute('SELECT * from `admin` where `login`=:login AND `password`=:password', {
                    login,
                    password,
            }) as [AdminRecord[]];
            return results.length === 1;
        }
        catch (e) {
            console.log('DB error')
        }
    }
}