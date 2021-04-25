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
  @Input() item: Task; // Each task item received from DragDropComponent
  @Input() users: User[];// User data received from DragDropComponent

  @Output()
  delete = new EventEmitter<string>(); // call delete api from current to DragDropComponent

  @Output()
  update = new EventEmitter<Task>();// call update api from current to DragDropComponent

  pictureUrl = '';

  constructor(
    public dialog: MatDialog
  ) {
    this.item = new Task();
    this.users = [];
  }

  ngOnInit(): void {
  }

  // Detect changes incoming from parent component and update profile picture
  ngOnChanges(changes: any) {
    this.users = extractProp(changes, 'users.currentValue', []);
    this.pictureUrl = extractProp(this.users.find(user => user.id == this.item.assigned_to), 'picture', '');
  }

  // Call delete function in parent component
  onClickDelete(id: string) {
    this.delete.emit(id);
  }

  // Call update function in parent component
  onEditClick(task: Task) {
    this.update.emit(task);
  }
}
