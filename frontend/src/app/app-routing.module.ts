import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DownloadsComponent as DownloadsComponent } from './components/downloads/downloads.component';
import { FilesComponent } from './components/files/files.component';
import { StartComponent } from './components/start/start.component';


const routes: Routes = [
  { path: 'start', component:  StartComponent},
  { path: 'downloads', component:  DownloadsComponent},
  { path: 'files', component: FilesComponent},
  { path: '**', redirectTo: '/start', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
