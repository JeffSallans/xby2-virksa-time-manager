import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'switch-activity',
    pathMatch: 'full'
  },
  {
    path: 'demo',
    loadChildren: './tab1/tab1.module#Tab1PageModule'
  },
  {
    path: 'switch-activity',
    loadChildren: './switch-activity-tab/switchActivityTab.module#SwitchActivityTabPageModule'
  },
  {
    path: 'review-activities',
    loadChildren: './tab3/tab3.module#Tab3PageModule'
  },
  {
    path: 'settings',
    loadChildren: './user-settings/user-settings.module#UserSettingsPageModule'
  },
  { path: 'add-activity', loadChildren: './add-activity/add-activity.module#AddActivityPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
