import { Component } from '@angular/core';
import * as moment from 'moment';
import { isNil, padStart, sortBy } from 'lodash';

import { TimeTrackingService, ActivityType, ActivitySession } from '../time-tracking';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  /**
   * Recorded activities
   */
  sortedActivityList: ActivitySession[] = [];

  /**
   * The ID of the selected activity
   */
  targetActivityId: string = '';

  /**
   * Updates the component every second to get the latest getDailyHourTotal
   */
  heartbeat: Date;

  constructor(private timeTrackingService: TimeTrackingService) {}

  ngOnInit(): void {
    this.timeTrackingService.getActivityList().then((activityList) => {
      this.sortedActivityList = sortBy(activityList, (activity: ActivitySession) => activity.startTime);
    });

    const removeDateInterval = setInterval(() => {
      this.heartbeat = new Date();
    }, 1000);
  }

  getActivityDuration(activity: ActivitySession): string {
    const duration: moment.Duration = activity.getDuration();
    return `${duration.hours()}:${padStart(duration.minutes().toString(), 2, '0')}:${padStart(duration.seconds().toString(), 2, '0')}`;
  }

  editActivity(activity: ActivitySession) {
    this.targetActivityId = activity.id;
  }

  saveActivity(activity: ActivitySession) {
    this.targetActivityId = '';
    this.timeTrackingService.saveActivity(activity);
  }
}
