import { MeetingDTO } from "../../models/datamodels/meeting";
import { MeetingModel } from "../../models/db/meeting";



export class MeetingDAO {

    public async create(userDetails: MeetingDTO): Promise<any> {
        const query = MeetingModel.create(userDetails);
        const res = await query;
        return res;
    }

    public async findAll(email: string): Promise<MeetingDTO[]> {
        const query = MeetingModel.find({ members: email });
        const res = await query;
        return res;
    }

    public async find(id: string): Promise<MeetingDTO> {
        const query = MeetingModel.findOne({ id });
        const res = await query;
        return res[0];
    }
}

export const meetingDAO = new MeetingDAO();

export default meetingDAO;