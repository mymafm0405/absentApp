import { Student } from './student.model';
import { Injectable } from '@angular/core';
import { Report } from './report.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  foundStatus: boolean;
  students: Student[] = [
    new Student(1, 'Retaj Mahmoud', false),
    new Student(1, 'Asmaa Fouad', false),
    new Student(1, 'Basem Yhya', false)
  ];

  reports: Report[] = [
    new Report('1', '2020-12-24', this.students),
    new Report('1', '2020-10-24', this.students)
  ];

  constructor(private http: HttpClient) { }

  getStudents() {
    return this.students;
  }

  getReports() {
    // return this.reports.slice()
    return this.http.get('https://absentsapp-default-rtdb.firebaseio.com/reports.json')
  }

  startNewDay() {
    for (let student of this.students) {
      student.status = false;
    }
    return this.students;
  }

  checkReportExist(date: string): boolean {
    this.getStudentsReport(date)
    .subscribe(
      (myData) => {
        this.reports = myData;
        console.log(this.reports);
        const currentReport: Report = this.reports.find(report => report.date === date);
        if (currentReport) {
          this.foundStatus = true;
        } else {
          this.foundStatus = false;
        }
      }
    );
    return this.foundStatus;
  }

  saveReport(newReport: Report) {
    // this.reports.push(newReport);
    return this.http.post('https://absentsapp-default-rtdb.firebaseio.com/reports.json', newReport)
  }

  updateTodayReport(date: string, students: Student[]) {
    this.reports.find(report => report.date === date).students = students;
  }

  getStudentsReport(date: string) {
    return this.getReports()
    .pipe(map(
      (resData) => {
        const data: Report[] = [];
        for(const key in resData) {
          if (resData.hasOwnProperty(key)) {
            data.push({...resData[key], id: key})
          }
        }
        return data;
      }
    ))
  }
}
