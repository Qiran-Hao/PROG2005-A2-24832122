import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Item } from '../../models/item';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit {
  searchKeyword: string = '';
  selectedCategory: string = 'All';
  onlyPopular: boolean = false;
  filteredItems: Item[] = [];
  inventory: Item[] = [];

  selectedStockStatus: string = '';
  popularFilter: string = 'all';

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
    this.inventoryService.inventory$.subscribe(data => {
      this.inventory = data;
      this.applyFilter();
    });
  }

  doSearch(): void {
    this.applyFilter();
  }

  /**
   * Application search + filtering logic
   */
  applyFilter(): void {
    let result = [...this.inventory];

    // 1. Keyword search
    if (this.searchKeyword.trim()) {
      const lowerKeyword = this.searchKeyword.trim().toLowerCase();
      result = result.filter(item => item.itemName.toLowerCase().includes(lowerKeyword));
    }

    // 2. Classification filtering
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      result = result.filter(item => item.category === this.selectedCategory);
    }

    // 3. Inventory status filtering
    if (this.selectedStockStatus) {
      result = result.filter(item => item.stockStatus === this.selectedStockStatus);
    }

    // 4. Popular product filter
    if (this.popularFilter === 'popular') {
      result = result.filter(item => item.isPopular);
    } else if (this.popularFilter === 'not-popular') {
      result = result.filter(item => !item.isPopular);
    }

    this.filteredItems = result;
  }

  /**
   * Reset the filtering conditions
   */
  resetFilter(): void {
    this.searchKeyword = '';
    this.selectedCategory = 'All';
    this.onlyPopular = false;
    this.selectedStockStatus = '';
    this.popularFilter = 'all';
    this.applyFilter();
  }

  /**
   * Get all categories
   */
  get categories(): string[] {
    return ['All', ...this.inventoryService.getAllCategories()];
  }
}