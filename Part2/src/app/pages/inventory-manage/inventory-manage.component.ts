import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Item } from '../../models/item';

@Component({
  selector: 'app-inventory-manage',
  templateUrl: './inventory-manage.component.html',
  styleUrls: ['./inventory-manage.component.css']
})
export class InventoryManageComponent implements OnInit {
  // Add new product form data
  newItem: Item = {
    itemId: '',
    itemName: '',
    category: 'Electronics',
    quantity: 0,
    price: 0,
    supplierName: '',
    stockStatus: 'In Stock',
    isPopular: false
  };

  // Update/Delete form data
  targetItemName: string = '';
  updateData: Partial<Item> = {
    quantity: undefined,
    price: undefined,
    isPopular: false
  };

  // Message prompt
  alertMessage: string = '';
  isError: boolean = false;

  // Inventory data
  inventory: Item[] = [];

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
    // Subscribe to inventory data for real-time updates
    this.inventoryService.inventory$.subscribe(data => {
      this.inventory = data;
    });
  }

  /**
   * Subscribe to inventory data for real-time updates
   */
  private showAlert(message: string, isError: boolean = false): void {
    this.alertMessage = message;
    this.isError = isError;
    // It will be automatically cleared in 3 seconds
    setTimeout(() => {
      this.alertMessage = '';
    }, 3000);
  }

  /**
   * Handle newly added goods
   */
  handleAddItem(): void {
    const result = this.inventoryService.addItem({ ...this.newItem });
    this.showAlert(result.message, !result.success);
    // Reset the form after success
    if (result.success) {
      this.newItem = {
        itemId: '',
        itemName: '',
        category: 'Electronics',
        quantity: 0,
        price: 0,
        supplierName: '',
        stockStatus: 'In Stock',
        isPopular: false
      };
    }
  }

  /**
   * Handle updated goods
   */
  handleUpdateItem(): void {
    if (!this.targetItemName.trim()) {
      this.showAlert('Please enter the item name to update!', true);
      return;
    }
    const result = this.inventoryService.updateItemByName(this.targetItemName, { ...this.updateData });
    this.showAlert(result.message, !result.success);
    // Reset the form after success
    if (result.success) {
      this.targetItemName = '';
      this.updateData = {
        quantity: undefined,
        price: undefined,
        isPopular: false
      };
    }
  }

  /**
   * Handle the deletion of goods
   */
  handleDeleteItem(): void {
    if (!this.targetItemName.trim()) {
      this.showAlert('Please enter the item name to delete!', true);
      return;
    }
    //Confirm deletion
    const isConfirmed = confirm('Are you sure you want to delete this item? This action cannot be undone.');
    if (!isConfirmed) return;

    const result = this.inventoryService.deleteItemByName(this.targetItemName);
    this.showAlert(result.message, !result.success);
    // Reset the form after success
    if (result.success) {
      this.targetItemName = '';
    }
  }

  /**
   * Get all categories
   */
  get categories(): string[] {
    return this.inventoryService.getAllCategories();
  }
}
