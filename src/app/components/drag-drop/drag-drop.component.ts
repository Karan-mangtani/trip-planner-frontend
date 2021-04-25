import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from 'src/app/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { User } from 'src/app/models/user.model';
import { TasksService } from 'src/app/services/tasks.service';
import { sortList } from 'src/app/utlities';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss']
})
export class DragDropComponent implements OnInit, OnChanges {
  @Input() tasks: Task[] = []; //Tasks recieved from ViewTaskComponent
  @Input() users: User[] = []; // User recieved from ViewTaskComponent

  @Output()
  delete = new EventEmitter<string>(); // call delete api from current to ViewTaskComponent

  @Output()
  openDialog = new EventEmitter<Task>(); // call openDialog func from current to ViewTaskComponent

  @Output()
  updateTask = new EventEmitter<Task>(); // call update api from current to ViewTaskComponent

  @ViewChild(TaskCardComponent) child!: TaskCardComponent; // To call functions of TaskCardComponent

  low: Task[] = [];
  medium: Task[] = [];
  high: Task[] = [];

  constructor(public taskService: TasksService) { }

  ngOnInit(): void {
    this.filterTask(this.tasks);
  }

  // Detect changes incoming from parent component
  ngOnChanges(changes: any) {
    if (changes.tasks) {
      this.filterTask(changes.tasks.currentValue);
    }
  }

  // FIlter and sort tasks based on due date and priority
  filterTask(tasks: Task[]) {
    this.low = (sortList(tasks.filter(task => task.priority == '1'), 'due_date') as Task[]);
    this.medium = (sortList(tasks.filter(task => task.priority == '2'), 'due_date') as Task[]);
    this.high = (sortList(tasks.filter(task => task.priority == '3'), 'due_date') as Task[]);
  }

  // func on drop event and call update api
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      const updatedTask: Task = event.container.data[event.currentIndex];
      switch (event.container.id) {
        case 'cdk-drop-list-0': {
          this.updateTask.emit({ ...updatedTask, priority: '3' });
          break;
        }
        case 'cdk-drop-list-1': {
          this.updateTask.emit({ ...updatedTask, priority: '2' });
          break;
        }
        case 'cdk-drop-list-2': {
          this.updateTask.emit({ ...updatedTask, priority: '1' });
          break;
        }
        default:
          break;
      }
    }
  }

  // call delete api func child to parent component
  onClickDelete(id: string) {
    this.delete.emit(id);
  }

  // open add update dialog from child to parent component
  onEditClick(task: Task) {
    this.openDialog.emit(task);
  }

}
