import { Injectable } from '@angular/core';
import {
	isEmpty,
	isNil,
	cloneDeep,
	map,
	defaultTo,
	reduce,
} from 'lodash';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';

import { ActivitySession } from '../models/activity-session';
import { ActivityType } from '../models/activity-type';
import { UserSettingsService } from '../user-settings/user-settings.service';

const storageKey = 'TimeTrackingServiceKey';

@Injectable({
	providedIn: 'root'
})
export class TimeTrackingService {
	/** All the activities the user has recorded */
	private activityList: ActivitySession[] = [];
	/** Resolves when the activity list has been loaded in the app */
	private storagePromise: Promise<void>;

	constructor(
		private storage: Storage,
		private userSettingsService: UserSettingsService,
	) {
		this.storagePromise = storage.get(storageKey)
			.then(data => {
				if (!isEmpty(data)) {
					// Convert string to properly formed JSON
					const activityListWithoutClasses = JSON.parse(data);
					return this.getPossibleActivityTypes()
						.then(possibleActivityTypes => {
							const loadedActivityList: ActivitySession[] = map(activityListWithoutClasses, 
								(activityWithoutClasses) => 
								ActivitySession.convertObject(activityWithoutClasses, possibleActivityTypes)
							);
							this.activityList = loadedActivityList;
						});
				}
			});
	}

	private getCurrentRunningActivityReference() {
			const currentActivity = this.activityList.find((activity) => isNil(activity.stopTime));
			return currentActivity;
	}

	getActivityList(): Promise<ActivitySession[]> {
		return this.storagePromise.then(() => {
			return cloneDeep(this.activityList);
		});
	}

	getPossibleActivityTypes(): Promise<ActivityType[]> {
		return this.userSettingsService.getUserSettings()
			.then(userSettings => userSettings.possibleActivityTypes);
	}

	addActivity(newActivitySession: ActivitySession) {
		// Can only add activities that have finished
		if (isNil(newActivitySession.stopTime)) {
			return;
		}
		this.activityList.push(newActivitySession);

		// Save to storage
		this.storage.set(storageKey, JSON.stringify(this.activityList));
	}

	startActivity(newActivityType: ActivityType) {
		// Stop current activity
		const currentActivity = this.getCurrentRunningActivityReference();
		if (!isNil(currentActivity)) {
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
		if (!isNil(currentActivity)) {
			currentActivity.stopTime = moment();
		}

		// Save to storage
		this.storage.set(storageKey, JSON.stringify(this.activityList));
	}

	getCurrentRunningActivity(): ActivitySession | null {
			return defaultTo(cloneDeep(this.getCurrentRunningActivityReference()), null);
	}

	getTotalDailyTimeForActivity(activityType: ActivityType, dayOfActivity: moment.Moment = moment()): moment.Duration {
			const activities = this.activityList.filter((activity) => activityType.id === activity.activityType.id && dayOfActivity.date() === activity.startTime.date());
			const totalDuration = reduce(activities, (resultSoFar: moment.Duration, activity: ActivitySession) => {
					resultSoFar.add(activity.getDuration());
					return resultSoFar;
			}, moment.duration());
			return totalDuration;
	}

	getTotalWeeklyTimeForActivity(activityType: ActivityType): moment.Duration {
			const activities = this.activityList.filter((activity) => activityType.id === activity.activityType.id);
			const totalDuration = reduce(activities, (resultSoFar: moment.Duration, activity: ActivitySession) => {
					resultSoFar.add(activity.getDuration());
					return resultSoFar;
			}, moment.duration());
			return totalDuration;
	}

	saveActivity(activityToSave: ActivitySession): Promise<void> {
		return this.storagePromise.then(() => {
			const activityListResult = reduce(this.activityList, (resultSoFar, activity) => {
				// Save new activity if id matches
				if (activityToSave.id === activity.id) {
					resultSoFar.push(activityToSave);
				} else {
					resultSoFar.push(activity);
				}
				return resultSoFar;
			}, []);
	
			// Update activityList
			this.activityList = activityListResult;

			// Save to storage
			this.storage.set(storageKey, JSON.stringify(this.activityList));
		});
	}
}
