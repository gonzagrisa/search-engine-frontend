import { IStatus } from "./i-status";

export interface IService extends IStatus {
    serviceId?: number;
    URLResource?: string;
    URLPing?: string;
    protocol?: string;
}
