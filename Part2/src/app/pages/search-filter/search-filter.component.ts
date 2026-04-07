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

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
    // Subscribe to inventory data
    this.inventoryService.inventory$.subscribe(data => {
      this.inventory = data;
      this.applyFilter();
    });
  }

  /**
   * Apply search and filter conditions
   */
  applyFilter(): void {
    let result = [...this.inventory];

    // Keyword search
    if (this.searchKeyword.trim()) {
      const lowerKeyword = this.searchKeyword.trim().toLowerCase();
      result = result.filter(item => item.itemName.toLowerCase().includes(lowerKeyword));
    }

    // Classification filtering
    if (this.selectedCategory !== 'All') {
      result = result.filter(item => item.category === this.selectedCategory);
    }

    // Popular product filter
    if (this.onlyPopular) {
      result = result.filter(item => item.isPopular);
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
    this.applyFilter();
  }

  /**
   * Get all categories
   */
  get categories(): string[] {
    return ['All', ...this.inventoryService.getAllCategories()];
  }
}