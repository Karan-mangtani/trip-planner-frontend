import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { extractProp } from '../../utlities/index';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit, OnChanges {
  @Input() item: Task;
  @Input() users: User[];

  @Output()
  delete = new EventEmitter<string>();

  @Output()
  update = new EventEmitter<Task>();

  pictureUrl = '';

  constructor(
    public dialog: MatDialog
  ) {
    this.item = new Task();
    this.users = [];
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    this.users = extractProp(changes, 'users.currentValue', []);
    this.pictureUrl = extractProp(this.users.find(user => user.id == this.item.assigned_to), 'picture', '');
  }

  deleteTask(id: string) {
    this.delete.emit(id);
  }

  onEditClick(task: Task) {
    this.update.emit(task);
  }
}
