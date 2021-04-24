import { Component, OnInit, ViewChild } from '@angular/core';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DragDropComponent } from '../drag-drop/drag-drop.component';
import { AddUpdateDialogComponent } from '../add-update-dialog/add-update-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { extractProp, formatDate } from 'src/app/utlities';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.scss']
})
export class ViewTasksComponent implements OnInit {
  @ViewChild(DragDropComponent) child!: DragDropComponent;

  users: User[] = [];
  tasks: Task[];
  filteredTasks: Task[];
  search = new FormControl('');

  subscription: Subscription = new Subscription;

  constructor(
    private taskService: TasksService,
    public dialog: MatDialog
  ) {
    this.tasks = [];
    this.filteredTasks = [];
  }

  ngOnInit(): void {
    this.getTasks();
    this.getUsers();
    var subscription1 = this.search.valueChanges.subscribe((value => this.performSearch(value)));
    this.subscription.add(subscription1);
  }


  performSearch(filterBy: string) {
    filterBy = filterBy.toLocaleLowerCase();
    this.filteredTasks = this.tasks.filter((singletask: Task) => {
      return singletask.message.toLocaleLowerCase().indexOf(filterBy) !== -1;
    });
  }

  getTasks() {
    var subscription4 = this.taskService.getTasks().subscribe((data: any) => {
      this.tasks = data.tasks;
      this.filteredTasks = data.tasks;
    });
    this.subscription.add(subscription4);
  }

  getUsers() {
    var subscription5 = this.taskService.getUsers().subscribe((data: any) => {
      this.users = data.users;
    });
    this.subscription.add(subscription5);
  }

  updatetaskData(tasks: Task[]) {
    this.tasks = tasks;
    this.filteredTasks = this.tasks;
  }

  onClickAdd() {
    this.openDialog(new Task());
  }

  addTask(task: any) {
    const formData: any = new FormData();
    formData.append('message', task.message);
    formData.append('due_date', formatDate(task.due_date));
    formData.append('priority', task.priority);
    formData.append('assigned_to', task.assigned_to);
    var subscription2 = this.taskService.createtask(formData).subscribe((data) => {
      if (data.status == 'success') {
        const newTask: Task = {
          ...task,
          id: data.taskid,
          assigned_name: extractProp(this.users.find(user => user.id == task.assigned_to), 'name', '')
        };
        this.updatetaskData([...this.tasks, newTask]);
      }
    });
    this.subscription.add(subscription2);
  }

  updateTask(task: any) {
    const formData: any = new FormData();
    formData.append('message', task.message);
    formData.append('due_date', formatDate(task.due_date));
    formData.append('priority', task.priority);
    formData.append('assigned_to', task.assigned_to);
    formData.append('taskid', task.id);
    var subscription3 = this.taskService.updateTask(formData).subscribe((data) => {
      if (data.status == 'success') {
        this.tasks = this.tasks.filter(t => t.id != task.id);
        const newTask: Task = {
          ...task,
          assigned_name: extractProp(this.users.find(user => user.id == task.assigned_to), 'name', '')
        };
        this.updatetaskData([...this.tasks, newTask]);
      }
    });
    this.subscription.add(subscription3);
  }

  deleteTask(id: string) {
    const formData: any = new FormData();
    formData.append('taskid', id);
    var subscription6 = this.taskService.deleteTask(formData).subscribe((data) => {
      if (data.status == 'success') {
        this.updatetaskData(this.tasks.filter(task => task.id != id));
      }
    });
    this.subscription.add(subscription6);
  }

  openDialog(task: Task) {
    const dialogRef = this.dialog.open(AddUpdateDialogComponent, {
      width: '600px',
      data: { users: this.users, task }
    });

    var subscription7 = dialogRef.afterClosed().subscribe(result => {
      this.addUpdateTask(result);
    });
    this.subscription.add(subscription7);
  }

  addUpdateTask(task: any) {
    if (task.id) {
      this.updateTask(task);
    } else {
      this.addTask(task);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
