import { Report } from './../report.model';
import { StudentsService } from './../students.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Student } from '../student.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @ViewChild('f', {static: false}) searchForm: NgForm;
  currentDate: string;
  students: Student[] = [];
  reports: Report[] = [];

  constructor(private studentsService: StudentsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.currentDate = params.date;
        this.studentsService.getStudentsReport(params.date)
        .subscribe(
          (myData) => {
            this.reports = myData;
            console.log(this.reports);
            const currentReport: Report = this.reports.find(report => report.date === params.date);
            if (currentReport) {
              const currentStudents: Student[] = this.reports.find(report => report.date === params.date).students;
              this.students = currentStudents;
            } else {
              this.students = [];
            }
          }
        );
        console.log(this.currentDate);
        console.log(this.students);
      }
    )
  }

  onSearch() {
    const searchInput:string = this.searchForm.value.search;
    if (this.studentsService.checkReportExist(searchInput)) {
      this.router.navigate(['reports', searchInput])
      this.studentsService.getStudentsReport(searchInput)
      .subscribe(
        (myData) => {
          this.reports = myData;
          console.log(this.reports);
          const currentReport: Report = this.reports.find(report => report.date === searchInput);
          if (currentReport) {
            const currentStudents: Student[] = this.reports.find(report => report.date === searchInput).students;
            this.students = currentStudents;
          } else {
            this.students = [];
          }
        }
      );
    } else {
      this.router.navigate(['reports', searchInput])
      this.students = [];
    }
  }

}
