import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DownloadsComponent as DownloadsComponent } from './components/downloads/downloads.component';
import { FilesComponent } from './components/files/files.component';
import { StartComponent } from './components/start/start.component';
import { StreamComponent } from './components/stream/stream.component';


const routes: Routes = [
  { path: 'start', component:  StartComponent},
  { path: 'downloads', component:  DownloadsComponent},
  { path: 'files', component: FilesComponent},
  { path: 'stream/:filename', component: StreamComponent},
  { path: '**', redirectTo: '/start', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
