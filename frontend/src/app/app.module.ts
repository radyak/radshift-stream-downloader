import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'; 
import { MatInputModule, MatRadioModule } from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DownloadsComponent } from './components/downloads/downloads.component';
import { FilesComponent } from './components/files/files.component';
import { FormsModule } from '@angular/forms';

import { FilesizePipe } from './pipes/filesize.pipe';
import { StartComponent } from './components/start/start.component';
import { TimespanPipe } from './pipes/timespan.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthHttpInterceptor } from './interceptors/auth-http.interceptor';
import { StreamComponent } from './components/stream/stream.component';

@NgModule({
  declarations: [
    AppComponent,
    DownloadsComponent,
    FilesComponent,
    FilesizePipe,
    StartComponent,
    TimespanPipe,
    StreamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
