import { Component, OnInit } from '@angular/core';
import { TimeTrackingService } from '../time-tracking';
import { ActivitySession } from '../models/activity-session';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ActivityType } from '../models/activity-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.page.html',
  styleUrls: ['./add-activity.page.scss'],
})
export class AddActivityPage implements OnInit {

  possibleActivityTypes: ActivityType[] = [];

  addForm: FormGroup;

  constructor(
    private timeTrackingService: TimeTrackingService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.timeTrackingService.getPossibleActivityTypes()
      .then(possibleActivityTypes => this.possibleActivityTypes = possibleActivityTypes);

    this.addForm = this.fb.group({
      type: ['', Validators.required],
      duration: ['', Validators.required]
    })
  }

  save() {
    const formData = this.addForm.value;
    const stopTime = moment();
    const startTime = moment().subtract(formData.duration, 'minutes');
    const newActivitySession = new ActivitySession(formData.type, startTime, stopTime); 
    this.timeTrackingService.addActivity(newActivitySession);
    this.router.navigateByUrl('/review-activities');
  }

}
