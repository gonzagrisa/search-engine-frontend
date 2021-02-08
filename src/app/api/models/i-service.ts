export interface IService {
    serviceId?: number;
    userId?: number;
    URLResource?: string;
    URLPing?: string;
    protocol?: string;
    indexed?: boolean;
    reindex?: boolean;
    isUp?: boolean;
}
