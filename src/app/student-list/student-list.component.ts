import { Report } from './../report.model';
import { StudentsService } from './../students.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from '../student.model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  @ViewChild('stuForm', {static: false}) stuForm: NgForm;
  currentStudents: Student[] = [];
  todayDate = '';
  reports: Report[] = [];

  addedSuccessfully = false;
  errorReportExist = false;
  savedSuccess = false;
  updateReport = false;
  viewStudent = false;
  viewStuForm = false;
  constructor(private studentsService: StudentsService, private router: Router) { }

  ngOnInit(): void {
    this.getMyStudentsList();
  }

  getMyStudentsList() {
    this.studentsService.getStudents()
    .subscribe(
      (stuData) => {
        this.currentStudents = stuData;
        console.log(this.currentStudents);
        this.getTodayDate();
      }
    )
  }

  onSwitchClick(index: number) {
    this.currentStudents[index].status = !this.currentStudents[index].status;
  }

  onAddStudent() {
    this.viewStuForm = !this.viewStuForm;
  }
  
  onAddStudentSubmit() {
    const fakeId = 'fake'
    const stuName = this.stuForm.value.stuName;
    const newStudent = new Student(fakeId, stuName, false);
    this.studentsService.addStudent(newStudent).subscribe(
      (res) => {
        this.getMyStudentsList();
        console.log(res);
        this.addedSuccessfully = true;
        setTimeout(() => {
          this.addedSuccessfully = false;
        }, 2000)
      }
    )
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
      this.studentsService.startNewDay()
      .subscribe(
        (stuData) => {
          for (let student of stuData) {
            student.status = false;
          }
          this.currentStudents = stuData;
        }
      );
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
