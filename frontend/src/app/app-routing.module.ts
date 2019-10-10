import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { DownloadsComponent } from './components/downloads/downloads.component';
import { FilesComponent } from './components/files/files.component';


const routes: Routes = [
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: 'start', component:  StartComponent},
  { path: 'downloads', component:  DownloadsComponent},
  { path: 'files', component: FilesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
