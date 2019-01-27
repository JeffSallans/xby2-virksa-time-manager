import { Component } from '@angular/core';
import * as moment from 'moment';
import { isNil, padStart } from 'lodash';

import { TimeTrackingService, ActivityType, ActivitySession } from '../time-tracking';

@Component({
  templateUrl: 'switchActivityTab.page.html',
  styleUrls: ['switchActivityTab.page.scss']
})
export class SwitchActivityTabPage {

  /**
   * Possible activities to render
   */
  possibleActivityTypes: ActivityType[];
  /**
   * Updates the component every second to get the latest getDailyHourTotal
   */
  heartbeat: Date;

  constructor(private timeTrackingService: TimeTrackingService) {}

  ngOnInit(): void {
    this.possibleActivityTypes = this.timeTrackingService.getPossibleActivityTypes();

    const removeDateInterval = setInterval(() => {
      this.heartbeat = new Date();
    }, 1000);
  }

  getDailyHourTotal(activityType: ActivityType): string {
    const duration: moment.Duration = this.timeTrackingService.getTotalDailyTimeForActivity(activityType);
    return `${duration.hours()}:${padStart(duration.minutes().toString(), 2, '0')}:${padStart(duration.seconds().toString(), 2, '0')}`;
  }

  startActivity(activityType: ActivityType) {
    this.timeTrackingService.startActivity(activityType);
  }

  pauseActivity(activityType: ActivityType) {
    this.timeTrackingService.pauseActivity();
  }

  /**
   * Returns true if the given activity is what the user is working on (aka current)
   * @param activityType The Activity to check
   */
  isCurrentActivity(activityType: ActivityType): boolean {
    const currentActivity: ActivitySession | null = this.timeTrackingService.getCurrentRunningActivity();

    return !isNil(currentActivity) && currentActivity.activityType.id === activityType.id;
  }

  /**
   * Returns the ion card class to show current activity
   * @param activityType The Activity to get the class for
   */
  getIonBadgeClasses(activityType: ActivityType): string {
    if (this.isCurrentActivity(activityType)) {
      return 'success';
    }
    return 'medium';
  }
}
