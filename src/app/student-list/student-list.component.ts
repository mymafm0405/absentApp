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
  today = new Date();
  errorReportExist = false;
  savedSuccess = false;
  updateReport = false;
  viewStudent = false;
  todayDate = this.today.getFullYear() + '-' + this.today.getMonth() + '-' + this.today.getDate();
  constructor(private studentsService: StudentsService, private router: Router) { }

  ngOnInit(): void {
    this.currentStudents = this.studentsService.getStudents();
  }

  onSwitchClick(index: number) {
    this.currentStudents[index].status = !this.currentStudents[index].status;
  }

  onNewDay() {
    this.viewStudent = true;
    if (this.studentsService.checkReportExist(this.todayDate)) {
      this.currentStudents = this.studentsService.getStudentsReport(this.todayDate);
    } else {
      this.currentStudents = this.studentsService.startNewDay();
    }
  }

  onFinish() {
    const id: string = this.todayDate;
    const newReport: Report = new Report(id, this.todayDate, this.currentStudents);
    if (!this.studentsService.checkReportExist(this.todayDate)) {
      this.studentsService.saveReport(newReport);
      // this.viewStudent = false;
      this.savedSuccess = true;
      setTimeout(() => {
        this.savedSuccess = false;
      }, 2000);
      console.log(this.studentsService.getReports());
    } else {
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
