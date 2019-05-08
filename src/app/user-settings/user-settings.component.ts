import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { UserSettings } from '../models/user-settings';
import { UserSettingsService } from './user-settings.service';
import { Subscription } from 'rxjs';
import { map } from 'lodash';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  /** The form on the page */
  settingsForm: FormGroup;

  /** All the subscriptions to unsubscribe to */
  private _subscriptions: Subscription[] = [];

  constructor(
    private userSettingsService: UserSettingsService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this._subscriptions.push(
      this.userSettingsService.onSettingsChange
        .subscribe(userSettings => {
          this.initializeForm(userSettings);
        })
    );
  }

  initializeForm(userSettings: UserSettings) {
    this.settingsForm = this.fb.group({
      possibleActivityTypes: this.fb.array(map(userSettings.possibleActivityTypes, (activityType) => {
        return this.fb.group({
          id: [activityType.id],
          name: [activityType.name],
          cssClass: [activityType.cssClass],
        });
      }))
    });
  }

  removeActivityType(index) {
    const possibleActivityTypes: FormArray = this.settingsForm.get('possibleActivityTypes') as FormArray;
    possibleActivityTypes.removeAt(index);
  }

  addActivityType() {
    const possibleActivityTypes: FormArray = this.settingsForm.get('possibleActivityTypes') as FormArray;
    possibleActivityTypes.push(
      this.fb.group({
        id: [''],
        name: [''],
        cssClass: ['']
      })
    );
  }

  save() {
    this.userSettingsService.setUserSettings(this.settingsForm.value);
  }

  cancel() {
    this.userSettingsService.getUserSettings()
      .then((userSettings) => {
        this.initializeForm(userSettings);
      });
  }

  ngOnDestroy() {
    this._subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this._subscriptions = [];
  }
}
