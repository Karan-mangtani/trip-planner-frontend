import { Component, OnInit, ViewChild } from '@angular/core';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { FormControl, FormGroup } from '@angular/forms'
import { DragDropComponent } from '../drag-drop/drag-drop.component';
import { AddUpdateDialogComponent } from '../add-update-dialog/add-update-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { extractProp, formatDate } from 'src/app/utlities';

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
    this.search.valueChanges.subscribe((value => this.performSearch(value)))
  }


  performSearch(filterBy: string) {
    filterBy = filterBy.toLocaleLowerCase();
    this.filteredTasks = this.tasks.filter((singletask: Task) => {
      return singletask.message.toLocaleLowerCase().indexOf(filterBy) !== -1;
    });
  }

  getTasks() {
    this.taskService.getTasks().subscribe((data: any) => {
      this.tasks = data.tasks;
      this.filteredTasks = data.tasks;
    });
  }

  getUsers() {
    this.taskService.getUsers().subscribe((data: any) => {
      this.users = data.users;
    })
  }

  updatetaskData(tasks: Task[]) {
    this.tasks = tasks;
    this.filteredTasks = this.tasks;
  }

  onClickAdd() {
    this.openDialog(new Task())
  }

  addTask(task: any) {
    var formData: any = new FormData();
    formData.append("message", task.message);
    formData.append("due_date", formatDate(task.due_date));
    formData.append("priority", task.priority);
    formData.append("assigned_to", task.assigned_to);
    this.taskService.createtask(formData).subscribe((data) => {
      if (data.status == "success") {
        let newTask: Task = {
          ...task,
          id: data.taskid, 
          assigned_name: extractProp(this.users.find(user => user.id == task.assigned_to), 'name', '')
        }
        this.updatetaskData([...this.tasks, newTask])
      }
    })
  }

  updateTask(task: any) {
    var formData: any = new FormData();
    formData.append("message", task.message);
    formData.append("due_date", formatDate(task.due_date));
    formData.append("priority", task.priority);
    formData.append("assigned_to", task.assigned_to);
    formData.append("taskid", task.id)
    this.taskService.updateTask(formData).subscribe((data) => {
      if (data.status == "success") {
        this.tasks = this.tasks.filter(t  => t.id != task.id);
        let newTask: Task = {
          ...task,
          assigned_name: extractProp(this.users.find(user => user.id == task.assigned_to), 'name', '')
        }
        this.updatetaskData([...this.tasks, newTask])
      }
    })
  }

  deleteTask(id: string) {
    var formData: any = new FormData();
    formData.append("taskid", id)
    this.taskService.deleteTask(formData).subscribe((data) => {
      if (data.status == "success") {
        this.updatetaskData(this.tasks.filter(task  => task.id != id))
      }
    })
  }

  openDialog(task: Task) {
    const dialogRef = this.dialog.open(AddUpdateDialogComponent, {
      width: '600px',
      data: { users: this.users, task }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addUpdateTask(result);
    });
  }

  addUpdateTask(task: any) {
    if (task.id) {
      this.updateTask(task);
    } else {
      this.addTask(task);
    }
  }

}
