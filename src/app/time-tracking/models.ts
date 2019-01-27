import * as moment from 'moment';
import { isNil, find } from 'lodash';

export class ActivityType {
    constructor(
        public id: string,
        public name: string,
        public cssClass: string) {

    }
}

export class ActivitySession {
    constructor(
        public activityType: ActivityType,
        public startTime: moment.Moment,
        public stopTime?: moment.Moment,
        public description?: string) {

    }

    /**
     * Creates a ActivitySession from the raw JSON object
     * @param activityWithoutClasses The structure of ActivitySession without classes.  For example JSON.parse(JSON.stringifty(new ActivitySession()))
     * @param possibleActivityTypes The possible activity types that could match to the activity classes
     */
    static convertObject(activityWithoutClasses, possibleActivityTypes: ActivityType[]):ActivitySession {
        const matchingActivityType = find(possibleActivityTypes, (activityType) => activityType.id === activityWithoutClasses.activityType.id);
        // Check parsing assumption
        if (isNil(matchingActivityType)) {
            console.error('ActivitySession.convertObject - Cannot convert object because ActivityType class could not be added', {
                howToFixThis: 'Review activityType and double check why it does not have an id that matches to possibleActivityTypes',
                activityType: activityWithoutClasses.activityType,
                possibleActivityTypes,
            });
        }

        // Create classes
        const loadedActivity = {
            ...activityWithoutClasses,
            activityType: matchingActivityType,
            startTime: moment(activityWithoutClasses.startTime),
            stopTime: isNil(activityWithoutClasses.stopTime) ? null : moment(activityWithoutClasses.stopTime),
        };
        return new ActivitySession(loadedActivity.activityType, loadedActivity.startTime, loadedActivity.stopTime, loadedActivity.description);
    }

    getDuration() : moment.Duration {
        if (isNil(this.stopTime)) {
            const currentTime = moment();
            const duration = moment.duration(currentTime.diff(this.startTime));
            return duration;
        }
        const duration = moment.duration(this.stopTime.diff(this.startTime));
        return duration;
    }
}
