import { Component, OnInit } from '@angular/core';
import { FiltersService } from '../filters.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  constructor(public filtersService: FiltersService, private pc: PopoverController) { }

  ngOnInit() {
  }

  applyFilters() {
    this.filtersService.applyFilters();
    this.pc.dismiss();
  }

}
