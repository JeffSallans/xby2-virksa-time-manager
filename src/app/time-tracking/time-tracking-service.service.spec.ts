import {
	map,
	merge,
	omit,
	isNil,
} from 'lodash';
import { TestBed } from '@angular/core/testing';
import { expectjs, registerSnapshots } from "jasmine-snapshot";

import { TimeTrackingService } from './time-tracking-service.service';
import { ActivitySession } from '../models/activity-session';
import { ActivityType } from '../models/activity-type';

const snapshots = {
	"TimeTrackingService startActivity creates an activity if none exist 1": `[ { "activityType": { "cssClass": ".nasco", "id": "NASCO", "name": "NASCO" }, "hasStartTime": true, "hasStopTime": false }]`,
	"TimeTrackingService startActivity stops the current activity 1": `[ { "activityType": { "cssClass": ".nasco", "id": "NASCO", "name": "NASCO" }, "hasStartTime": true, "hasStopTime": true }, { "hasStartTime": true, "hasStopTime": false }]`,
	"TimeTrackingService pauseActivity stops the current activity 1": `[ { "activityType": { "cssClass": ".nasco", "id": "NASCO", "name": "NASCO" }, "hasStartTime": true, "hasStopTime": true }]`
};

describe('TimeTrackingService', () => {
	beforeAll(() => registerSnapshots(snapshots, 'TimeTrackingService'));
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: TimeTrackingService = TestBed.get(TimeTrackingService);
		expect(service).toBeTruthy();
	});

	describe('getCurrentRunningActivity', () => {
		it('returns null if no activity has been started', () => {
			// Setup
			const service: TimeTrackingService = TestBed.get(TimeTrackingService);
			// Validate
			const currentActivity: ActivitySession = service.getCurrentRunningActivity();
			expect(currentActivity).toBeNull();
		});

		it('returns the latest activity', () => {
			// Setup
			const service: TimeTrackingService = TestBed.get(TimeTrackingService);
			const activityType: ActivityType = service.getPossibleActivityTypes()[0];
			service.startActivity(activityType);
			// Validate
			const currentActivity: ActivitySession = service.getCurrentRunningActivity();
			expect(currentActivity.activityType).toEqual(activityType);
		});

		it('returns null if the last activity was paused', () => {
			// Setup
			const service: TimeTrackingService = TestBed.get(TimeTrackingService);
			service.startActivity(service.getPossibleActivityTypes()[0]);
			service.pauseActivity();
			// Validate
			const currentActivity: ActivitySession = service.getCurrentRunningActivity();
			expect(currentActivity).toBeNull();
		});
	});

	describe('startActivity', () => {
		it('creates an activity if none exist', () => {
			// Setup
			const service: TimeTrackingService = TestBed.get(TimeTrackingService);
			service.startActivity(service.getPossibleActivityTypes()[0]);
			// Validate
			service.getActivityList()
			.then((activityList) => {
				const result = map(activityList, (activity) => {
					return merge(omit(activity, ['startTime', 'stopTime']), {
						hasStartTime: !isNil(activity.startTime),
						hasStopTime: !isNil(activity.stopTime),
					});
				});
				expectjs(result).toMatchSnapshot();
			});
		});

		it('stops the current activity', () => {
			// Setup
			const service: TimeTrackingService = TestBed.get(TimeTrackingService);
			service.startActivity(service.getPossibleActivityTypes()[0]);
			service.startActivity(service.getPossibleActivityTypes()[0]);
			// Validate
			service.getActivityList()
			.then((activityList) => {
				const result = map(activityList, (activity) => {
					return merge(omit(activity, ['startTime', 'stopTime']), {
						hasStartTime: !isNil(activity.startTime),
						hasStopTime: !isNil(activity.stopTime),
					});
				});
				expectjs(result).toMatchSnapshot();
			});
		});
	});

	describe('pauseActivity', () => {		
		it('stops the current activity', () => {
			// Setup
			const service: TimeTrackingService = TestBed.get(TimeTrackingService);
			service.startActivity(service.getPossibleActivityTypes()[0]);
			service.pauseActivity();
			// Validate
			return service.getActivityList()
			.then((activityList) => {
				const result = map(activityList, (activity) => {
					return merge(omit(activity, ['startTime', 'stopTime']), {
						hasStartTime: !isNil(activity.startTime),
						hasStopTime: !isNil(activity.stopTime),
					});
				});
				expectjs(result).toMatchSnapshot();
			});
		});
		it('does nothing if the last activity was stopped', () => {
			// Setup
			let firstPauseResult;
			const service: TimeTrackingService = TestBed.get(TimeTrackingService);
			service.startActivity(service.getPossibleActivityTypes()[0]);
			service.pauseActivity();
			return service.getActivityList()
			.then((activityList) => {
				firstPauseResult = map(activityList, (activity) => {
					return merge(omit(activity, ['startTime', 'stopTime']), {
						hasStartTime: !isNil(activity.startTime),
						hasStopTime: !isNil(activity.stopTime),
					});
				});
				service.pauseActivity();
			})
			.then(() => service.getActivityList())
			.then((activityList) => {
				const secondPauseResult = map(activityList, (activity) => {
					return merge(omit(activity, ['startTime', 'stopTime']), {
						hasStartTime: !isNil(activity.startTime),
						hasStopTime: !isNil(activity.stopTime),
					});
				});

				// Validate
				expect(firstPauseResult).toEqual(secondPauseResult);
			});

		});
	});
});
