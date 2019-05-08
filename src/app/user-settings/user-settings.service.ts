import { Injectable } from '@angular/core';
import {
	isEmpty,
	cloneDeep,
} from 'lodash';
import { Storage } from '@ionic/storage';

import { UserSettings } from '../models/user-settings';
import { BehaviorSubject } from 'rxjs';

const storageKey = 'UserSettingsServiceKey';

@Injectable({
	providedIn: 'root'
})
export class UserSettingsService {
	private defaultSettings: UserSettings = {
        possibleActivityTypes: [
            { id: 'NASCO', name: 'NASCO', cssClass: '.nasco' },
            { id: 'NASCO-Rampup', name: 'NASCO Prep', cssClass: '.nasco' },
            { id: 'AO', name: 'AO work', cssClass: '.ao' },
            { id: 'AO-Assistance', name: 'Helping others at AO', cssClass: '.ao' },
            { id: 'XBY2-Recuriting', name: 'Recuriting', cssClass: '.xby2' },
            { id: 'XBY2-Mentor-Jason', name: 'Mentor Jason', cssClass: '.xby2' },
            { id: 'XBY2-Mentorship-Dave', name: 'Mentored by Dave', cssClass: '.xby2' },
            { id: 'XBY2-Advisor-Selina', name: 'Advise Selina', cssClass: '.xby2' },
            { id: 'XBY2-SIG', name: 'X by 2 SIGs', cssClass: '.xby2' },
            { id: 'XBY2-Other', name: 'Other things at X by 2', cssClass: '.xby2' },
        ],
        outlookApiKey: '',
    };
    /** Resolves when the settings have been loaded */
    private storagePromise: Promise<void>;
    /** Holds the user settings */
    private _settings = new BehaviorSubject<UserSettings>(this.defaultSettings);
    /** Use to subscribe to settings changes */
    onSettingsChange = this._settings.asObservable();

	constructor(private storage: Storage) {
		this.storagePromise = storage.get(storageKey)
			.then(data => {
				if (!isEmpty(data)) {
                    // Convert string to properly formed JSON
                    let settings = this.defaultSettings;
                    try {
                        settings = JSON.parse(data);
                    } catch(e) {
                        console.error(e);
                    }
					this._settings.next(settings);
				}
			});
	}

    /** Returns the user settings */
	getUserSettings(): Promise<UserSettings> {
		return this.storagePromise.then(() => {
			return cloneDeep(this._settings.getValue());
		});
	}

    /** Updates the user settings and stores them to disk */
	setUserSettings(newSettings: UserSettings): Promise<boolean> {
        this._settings.next(newSettings);
        // Save to storage
		return this.storage.set(storageKey, JSON.stringify(this._settings.getValue()));
	}
}
