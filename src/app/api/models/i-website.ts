import { IStatus } from "./i-status";

export interface IWebsite extends IStatus {
    websiteId?: number;
    url?: string;
}
