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
    // new Student('1', 'Retaj Mahmoud', false),
    // new Student('2', 'Asmaa Fouad', false),
    // new Student('3', 'Basem Yhya', false)
  ];

  reports: Report[] = [
    new Report('1', '2020-12-24', this.students),
    new Report('1', '2020-10-24', this.students)
  ];

  constructor(private http: HttpClient) { }

  addStudent(newStudent: Student) {
    return this.http.post('https://absentsapp-default-rtdb.firebaseio.com/students.json', newStudent)
  }

  getStudents() {
    return this.http.get('https://absentsapp-default-rtdb.firebaseio.com/students.json')
    .pipe(map(
      (resData) => {
        const data: Student[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            data.push({...resData[key], id: key})
          }
        }
        return data;
      }
    ))
  }

  getReports() {
    // return this.reports.slice()
    return this.http.get('https://absentsapp-default-rtdb.firebaseio.com/reports.json')
  }

  startNewDay() {
    return this.getStudents()
  }

  checkReportExist(date: string): boolean {
    this.getStudentsReport(date)
    .subscribe(
      (myData) => {
        this.reports = myData;
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
