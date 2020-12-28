import { Student } from "./student.model";

export class Report {
  constructor(public id: string, public date: string, public students: Student[]) {}
}
