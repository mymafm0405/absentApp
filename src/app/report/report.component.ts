import { StudentsService } from './../students.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Student } from '../student.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  currentDate: string;
  students: Student[] = [];

  constructor(private studentsService: StudentsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.currentDate = params.date;
        this.students = this.studentsService.getStudentsReport(params.date);
        console.log(this.currentDate);
        console.log(this.students);
      }
    )
  }

}
