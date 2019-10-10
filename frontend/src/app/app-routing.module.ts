import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DownloadsComponent as DownloadsComponent } from './components/downloads/downloads.component';
import { FilesComponent } from './components/files/files.component';


const routes: Routes = [
  { path: '', redirectTo: '/downloads', pathMatch: 'full' },
  { path: 'downloads', component:  DownloadsComponent},
  { path: 'files', component: FilesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
