/**
 * A possible activity the user could be doing
 */
export interface ActivityType {
    /** Unique identifier */
    id: string;
    /** Name to display to the user */
    name: string;
    /** Style to add to the card class */
    cssClass: string;
}