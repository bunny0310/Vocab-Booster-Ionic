import { Component, OnInit } from '@angular/core';
import { FiltersService } from '../filters.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  constructor(public filtersService: FiltersService) { }

  ngOnInit() {}

}
