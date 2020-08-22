import Axios from "axios";
import { RequestHandlerPort, Position } from "./request-handler-port";

export default class RequestHandler implements RequestHandlerPort {
    private readonly apiHost: string;

    constructor(apiHost: string) {
        this.apiHost = apiHost;
    }

    endTurn(battleId: string): Promise<any> {
        const url: string = this.apiHost + "/games/" + battleId + "/endTurn";
        return Axios.post(url);
    }

    getBattles(): Promise<any> {
        const url: string = this.apiHost + "/games/";
        return Axios.get(url);
    }

    move(battleId: string, unitId: string, position: Position): Promise<any> {
        const url: string = this.apiHost + "/games/" + battleId + "/units/" + unitId + "/move";
        return Axios.post(url, { position: position });
    }

    getPositions(battleId: string, unitId: string): Promise<any> {
        const url: string = this.apiHost + "/games/" + battleId + "/units/" + unitId + "/positions";
        return Axios.get(url);
    }

    getBattlefield(battlefieldId: string): Promise<any> {
        const url: string = this.apiHost + "/fields/" + battlefieldId;
        return Axios.get(url);
    }

    getBattle(battleId: string): Promise<any> {
        const url: string = this.apiHost + "/games/" + battleId;
        return Axios.get(url);
    }
}