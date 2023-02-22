import { UserDTO } from "../../models/datamodels/user";
import { UserModel } from "../../models/db/user";



export class UserDAO {

    public async create(userDetails: UserDTO): Promise<any> {
        const query = UserModel.create(userDetails);
        const res = await query;
        return res;
    }

    public async updateOneRecord(callSID: string, callDetails: UserDTO): Promise<any> {
        const query = UserModel.updateOne({ sid: callSID }, callDetails);
        const res = await query;
        return res;
    }

    public async findAll(): Promise<UserDTO[]> {
        const query = UserModel.find({ type: { $ne: "login" } });
        const res = await query;
        return res;
    }

    public async find(email: string): Promise<UserDTO> {
        const query = UserModel.find({ email: email });
        const res = await query;
        return res[0];
    }
}

export const userDAO = new UserDAO();

export default userDAO;