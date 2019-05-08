import { ActivityType } from "./activity-type";

/**
 * Settings the user configured for the application
 */
export interface UserSettings {
    /** The possible activities to record */
    possibleActivityTypes: ActivityType[];
    /** Key used to query outlook calendar info */
    outlookApiKey: string;
}