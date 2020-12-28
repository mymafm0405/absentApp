import { Student } from './student.model';
import { Injectable } from '@angular/core';
import { Report } from './report.model';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  students: Student[] = [
    new Student(1, 'Retaj Mahmoud', false),
    new Student(1, 'Asmaa Fouad', false),
    new Student(1, 'Basem Yhya', false)
  ];

  reports: Report[] = [];

  constructor() { }

  getStudents() {
    return this.students;
  }

  getReports() {
    return this.reports.slice()
  }

  startNewDay() {
    for (let student of this.students) {
      student.status = false;
    }
    return this.students;
  }

  checkReportExist(date: string) {
    const currentReport: Report = this.reports.find(report => report.date === date);
    if (currentReport) {
      return true;
    } else {
      return false;
    }
  }

  saveReport(newReport: Report) {
    this.reports.push(newReport);
  }

  updateTodayReport(date: string, students: Student[]) {
    this.reports.find(report => report.date === date).students = students;
  }

  getStudentsReport(date: string) {
    const currentReport: Report = this.reports.find(report => report.date === date);
    if (currentReport) {
      const currentStudents: Student[] = this.reports.find(report => report.date === date).students;
      return currentStudents;
    } else {
      return [];
    }
  }
}
