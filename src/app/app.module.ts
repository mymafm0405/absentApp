import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StudentComponent } from './student/student.component';
import { StudentListComponent } from './student-list/student-list.component';
import { ReportComponent } from './report/report.component';
import { StudentAddComponent } from './student-add/student-add.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  {path: '', component: StudentListComponent},
  {path: 'reports/:date', component: ReportComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    StudentListComponent,
    ReportComponent,
    StudentAddComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
