import { Component, OnInit, ViewChild } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { extractProp, formatDate } from 'src/app/utlities';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.scss']
})
export class ViewTasksComponent implements OnInit {

  cities: any[];
  tripCities: any[];
  search = new FormControl('');
  totalDistance = 0;

  subscription: Subscription = new Subscription;


  constructor(
    public taskService: TasksService,
    public dialog: MatDialog
  ) {
    this.cities = [];
    this.tripCities = [];
  }

  filteredOptions: Observable<any[]> | undefined;

  ngOnInit(): void {
    this.getTasks();
    this.filteredOptions = this.search.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  displayFn(city: any): string {
    return city && city.name ? city.name : '';
  }

  private _filter(value: string): string[] {
    if(typeof(value) === 'string') {
      const filterValue = value.toLowerCase();
      return this.cities.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    return [];
  }

  optionSelected(value: any) {
    this.taskService.getTrip(value.id).subscribe((data: any) => {
      this.tripCities = data;
      this.tripCities.forEach(city => this.totalDistance += city.distance);
      this.totalDistance = Math.round(this.totalDistance);
    });
  }

  // get items data from api
  getTasks() {
    var subscription4 = this.taskService.getCities().subscribe((data: any) => {
      this.cities = data ? data : [];
    });
    this.subscription.add(subscription4);
  }
  // Unsubscribe the subscription in the component
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
