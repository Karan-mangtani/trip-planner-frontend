import { Component, Inject, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface DialogData {
  task: Task;
  users: User[];
}

@Component({
  selector: 'app-add-update-dialog',
  templateUrl: './add-update-dialog.component.html',
  styleUrls: ['./add-update-dialog.component.scss']
})
export class AddUpdateDialogComponent implements OnInit, OnChanges {

  users: User[];

  taskForm = new FormGroup({
    id: new FormControl(''),
    message: new FormControl('', Validators.required),
    assigned_to: new FormControl('', Validators.required),
    priority: new FormControl('', Validators.required),
    due_date: new FormControl('', Validators.required)
  });

  minDate = new Date();

  constructor(
    public dialogRef: MatDialogRef<AddUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.users = this.data.users;
    this.taskForm.patchValue({
      id: this.data.task.id,
      message: this.data.task.message,
      assigned_to: this.data.task.assigned_to,
      priority: this.data.task.priority,
      due_date: new Date(this.data.task.due_date)
    });
  }


  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
  }

  // On click of cancel button
  closeDialog(): void {
    this.dialogRef.close();
  }

  // On click of submit button
  submitForm() {
    this.dialogRef.close(this.taskForm.value);
  }

  onSelect(event: any) {
  }

}
