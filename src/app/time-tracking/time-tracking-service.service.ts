import { Injectable } from '@angular/core';
import _ from 'lodash';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';

import {
		ActivitySession,
		ActivityType,
} from './models';

const storageKey = 'TimeTrackingServiceKey';

@Injectable({
	providedIn: 'root'
})
export class TimeTrackingService {
	private possibleActivityTypes: ActivityType[] = [
			new ActivityType('NASCO', 'NASCO', '.nasco'),
			new ActivityType('NASCO-Rampup', 'NASCO Prep', '.nasco'),
			new ActivityType('AO', 'AO work', '.ao'),
			new ActivityType('AO-Assistance', 'Helping others at AO', '.ao'),
			new ActivityType('XBY2-Recuriting', 'Recuriting', '.xby2'),
			new ActivityType('XBY2-Mentor-Jason', 'Mentor Jason', '.xby2'),
			new ActivityType('XBY2-Mentorship-Dave', 'Mentored by Dave', '.xby2'),
			new ActivityType('XBY2-Advisor-Selina', 'Advise Selina', '.xby2'),
			new ActivityType('XBY2-SIG', 'X by 2 SIGs', '.xby2'),
			new ActivityType('XBY2-Other', 'Other things at X by 2', '.xby2'),

	]
	private activityList: ActivitySession[] = [];

	constructor(private storage: Storage) {
		storage.get(storageKey)
			.then(data => {
				if (!_.isEmpty(data)) {
					// Convert string to properly formed JSON
					const activityListWithoutClasses = JSON.parse(data);
					const loadedActivityList: ActivitySession[] = _.map(activityListWithoutClasses, 
						(activityWithoutClasses) => 
						ActivitySession.convertObject(activityWithoutClasses, this.getPossibleActivityTypes())
					);
					this.activityList = loadedActivityList;
				}
			});
	}

	private getCurrentRunningActivityReference() {
			const currentActivity = this.activityList.find((activity) => _.isNil(activity.stopTime));
			return currentActivity;
	}

	getActivityList(): ActivitySession[] {
		return _.cloneDeep(this.activityList);
	}

	getPossibleActivityTypes(): ActivityType[] {
		return _.cloneDeep(this.possibleActivityTypes);
	}

	startActivity(newActivityType: ActivityType) {
		// Stop current activity
		const currentActivity = this.getCurrentRunningActivityReference();
		if (!_.isNil(currentActivity)) {
			currentActivity.stopTime = moment();
		}
		// Setup new activity
		const newActivity = new ActivitySession(newActivityType, moment());
		this.activityList.push(newActivity);

		// Save to storage
		this.storage.set(storageKey, JSON.stringify(this.activityList));
	}

	pauseActivity() {
		const currentActivity = this.getCurrentRunningActivityReference();
		if (!_.isNil(currentActivity)) {
			currentActivity.stopTime = moment();
		}

		// Save to storage
		this.storage.set(storageKey, JSON.stringify(this.activityList));
	}

	getCurrentRunningActivity(): ActivitySession | null {
			return _.defaultTo(_.cloneDeep(this.getCurrentRunningActivityReference()), null);
	}

	getTotalDailyTimeForActivity(activityType: ActivityType, dayOfActivity: moment.Moment = moment()): moment.Duration {
			const activities = this.activityList.filter((activity) => activityType.id === activity.activityType.id && dayOfActivity.date() === activity.startTime.date());
			const totalDuration = _.transform(activities, (resultSoFar: moment.Duration, activity: ActivitySession) => {
					resultSoFar.add(activity.getDuration());
			}, moment.duration());
			return totalDuration;
	}

	getTotalWeeklyTimeForActivity(activityType: ActivityType): moment.Duration {
			const activities = this.activityList.filter((activity) => activityType.id === activity.activityType.id);
			const totalDuration = _.transform(activities, (resultSoFar: moment.Duration, activity: ActivitySession) => {
					resultSoFar.add(activity.getDuration());
			}, moment.duration());
			return totalDuration;
	}
}
