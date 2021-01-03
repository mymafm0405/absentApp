import { Report } from './../report.model';
import { StudentsService } from './../students.service';
import { Component, OnInit } from '@angular/core';
import { Student } from '../student.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  currentStudents: Student[] = [];
  todayDate = '';
  reports: Report[] = [];

  errorReportExist = false;
  savedSuccess = false;
  updateReport = false;
  viewStudent = false;
  constructor(private studentsService: StudentsService, private router: Router) { }

  ngOnInit(): void {
    this.currentStudents = this.studentsService.getStudents();
    this.getTodayDate();
  }

  onSwitchClick(index: number) {
    this.currentStudents[index].status = !this.currentStudents[index].status;
  }

  onNewDay() {
    this.viewStudent = true;
    if (this.studentsService.checkReportExist(this.todayDate)) {
      this.studentsService.getStudentsReport(this.todayDate)
      .subscribe(
        (myData) => {
          this.reports = myData;
          console.log(this.reports);
          const currentReport: Report = this.reports.find(report => report.date === this.todayDate);
          if (currentReport) {
            const currentStudents: Student[] = this.reports.find(report => report.date === this.todayDate).students;
            this.currentStudents = currentStudents;
          } else {
            this.currentStudents = [];
          }
        }
      );
    } else {
      this.currentStudents = this.studentsService.startNewDay();
    }
  }

  getTodayDate() {
    const today = new Date();
    this.todayDate = today.getFullYear() + '-' + (String(today.getMonth() + 1).padStart(2, '0')) + '-' + String(today.getDate()).padStart(2, '0');
  }

  onFinish() {
    const id: string = this.todayDate;
    const newReport: Report = new Report(id, this.todayDate, this.currentStudents);
    if (!this.studentsService.checkReportExist(this.todayDate)) {
      this.studentsService.saveReport(newReport).subscribe(
        () => {
          this.savedSuccess = true;
          setTimeout(() => {
            this.savedSuccess = false;
          }, 2000);
        }
      );
      // this.viewStudent = false;
      // console.log(this.studentsService.getReports());
    } else {
      // // I need to update the current report on database..please check here.
      this.studentsService.updateTodayReport(this.todayDate, this.currentStudents);
      this.updateReport = true;
      setTimeout(() => {
        this.updateReport = false;
      }, 2000);
    }
  }

  onViewReport() {
    this.router.navigate(['reports', this.todayDate]);
  }

}
