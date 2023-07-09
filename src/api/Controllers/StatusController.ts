import { JsonController, Get } from 'routing-controllers';

@JsonController('/status')
export class StatusController {
    @Get()
    getStatus(): IGetStatus {
        return {
            status: 200,
            uptime: process.uptime(),
        };
    }
}

interface IGetStatus {
    status: number;
    uptime: number;
}
