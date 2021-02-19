import { IStatus } from "./i-status";

export interface IService extends IStatus {
    serviceId?: number;
    url?: string;
    protocol?: string;
}
