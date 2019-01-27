import _ from 'lodash';
import { TestBed } from '@angular/core/testing';
import { expectjs, registerSnapshots } from "jasmine-snapshot";

import { TimeTrackingService } from './time-tracking-service.service';
import {
	ActivitySession,
	ActivityType,
} from './models';

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
			const result = _.map(service.getActivityList(), (activity) => {
				return _.merge(_.omit(activity, ['startTime', 'stopTime']), {
					hasStartTime: !_.isNil(activity.startTime),
					hasStopTime: !_.isNil(activity.stopTime),
				});
			});
			expectjs(result).toMatchSnapshot();
		});

		it('stops the current activity', () => {
			// Setup
			const service: TimeTrackingService = TestBed.get(TimeTrackingService);
			service.startActivity(service.getPossibleActivityTypes()[0]);
			service.startActivity(service.getPossibleActivityTypes()[0]);
			// Validate
			const result = _.map(service.getActivityList(), (activity) => {
				return _.merge(_.omit(activity, ['startTime', 'stopTime']), {
					hasStartTime: !_.isNil(activity.startTime),
					hasStopTime: !_.isNil(activity.stopTime),
				});
			});
			expectjs(result).toMatchSnapshot();
		});
	});

	describe('pauseActivity', () => {		
		it('stops the current activity', () => {
			// Setup
			const service: TimeTrackingService = TestBed.get(TimeTrackingService);
			service.startActivity(service.getPossibleActivityTypes()[0]);
			service.pauseActivity();
			// Validate
			const result = _.map(service.getActivityList(), (activity) => {
				return _.merge(_.omit(activity, ['startTime', 'stopTime']), {
					hasStartTime: !_.isNil(activity.startTime),
					hasStopTime: !_.isNil(activity.stopTime),
				});
			});
			expectjs(result).toMatchSnapshot();
		});
		it('does nothing if the last activity was stopped', () => {
			// Setup
			const service: TimeTrackingService = TestBed.get(TimeTrackingService);
			service.startActivity(service.getPossibleActivityTypes()[0]);
			service.pauseActivity();
			const firstPauseResult = _.map(service.getActivityList(), (activity) => {
				return _.merge(_.omit(activity, ['startTime', 'stopTime']), {
					hasStartTime: !_.isNil(activity.startTime),
					hasStopTime: !_.isNil(activity.stopTime),
				});
			});
			service.pauseActivity();
			const secondPauseResult = _.map(service.getActivityList(), (activity) => {
				return _.merge(_.omit(activity, ['startTime', 'stopTime']), {
					hasStartTime: !_.isNil(activity.startTime),
					hasStopTime: !_.isNil(activity.stopTime),
				});
			});

			// Validate
			expect(firstPauseResult).toEqual(secondPauseResult);
		});
	});
});
