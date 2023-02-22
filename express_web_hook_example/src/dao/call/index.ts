import { CallDTO } from "../../models/datamodels/call";
import { CallModel } from "../../models/db/call";



export class CallDAO {

    public async createNewCall(callDetails: CallDTO): Promise<any> {
        const query = CallModel.create(callDetails);
        const res = await query;
        return res;
    }

    public async updateOneRecord(callSID: string, callDetails: CallDTO): Promise<any> {
        const query = CallModel.updateOne({ sid: callSID }, callDetails);
        const res = await query;
        return res;
    }

    public async findAll(): Promise<CallDTO[]> {
        const query = CallModel.find({});
        const res = await query;
        return res;
    }
}

export const callDAO = new CallDAO();

export default callDAO;