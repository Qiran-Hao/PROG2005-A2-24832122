import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // Private inventory data source, implementing responsive updates with BehaviorSubject
  private readonly inventorySubject = new BehaviorSubject<Item[]>([]);
  // For observable objects exposed to the outside, components can subscribe to obtain real-time data
  public inventory$ = this.inventorySubject.asObservable();

  constructor() {
    // Initialize the default data
    this.initDefaultData();
  }

  /**
   * Get a snapshot of the current inventory data
   */
  private get inventory(): Item[] {
    return this.inventorySubject.value;
  }

  /**
   * Initialize the default test data
   */
  private initDefaultData(): void {
    const defaultItems: Item[] = [
      {
        itemId: 'ITEM001',
        itemName: 'Gaming Laptop',
        category: 'Electronics',
        quantity: 12,
        price: 1499.99,
        supplierName: 'Tech Global Inc.',
        stockStatus: 'In Stock',
        isPopular: true,
        comment: 'Top selling gaming laptop 2026'
      },
      {
        itemId: 'ITEM002',
        itemName: 'Office Chair',
        category: 'Furniture',
        quantity: 3,
        price: 199.99,
        supplierName: 'Comfort Furniture',
        stockStatus: 'Low Stock',
        isPopular: false
      },
      {
        itemId: 'ITEM003',
        itemName: 'Cotton T-Shirt',
        category: 'Clothing',
        quantity: 0,
        price: 29.99,
        supplierName: 'Fashion Apparel',
        stockStatus: 'Out of Stock',
        isPopular: true
      }
    ];
    this.inventorySubject.next(defaultItems);
  }

  /**
   * Automatically calculate inventory status
   */
  private autoCalculateStockStatus(quantity: number): Item['stockStatus'] {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity < 5) return 'Low Stock';
    return 'In Stock';
  }

  /**
   * New products
   */
  addItem(item: Item): { success: boolean; message: string } {
    // Verify the uniqueness of the ID
    const isIdExists = this.inventory.some(i => i.itemId === item.itemId);
    if (isIdExists) {
      return { success: false, message: 'Item ID already exists!' };
    }

    // Verification required fields
    if (!item.itemId || !item.itemName || !item.category || !item.supplierName) {
      return { success: false, message: 'All required fields must be filled!' };
    }

    // The check digit is non-negative
    if (item.quantity < 0 || item.price < 0) {
      return { success: false, message: 'Quantity and price cannot be negative!' };
    }

    // Automatically calculate inventory status
    item.stockStatus = this.autoCalculateStockStatus(item.quantity);

    // Update inventory
    const newInventory = [...this.inventory, item];
    this.inventorySubject.next(newInventory);
    return { success: true, message: 'Item added successfully!' };
  }

  /**
   * Update the products by name
   */
  updateItemByName(itemName: string, updatedData: Partial<Item>): { success: boolean; message: string } {
    const itemIndex = this.inventory.findIndex(i => i.itemName.trim() === itemName.trim());
    if (itemIndex === -1) {
      return { success: false, message: 'Item not found!' };
    }

    // The check digit is non-negative
    if (updatedData.quantity !== undefined && updatedData.quantity < 0) {
      return { success: false, message: 'Quantity cannot be negative!' };
    }
    if (updatedData.price !== undefined && updatedData.price < 0) {
      return { success: false, message: 'Price cannot be negative!' };
    }

    // Automatically update inventory status
    if (updatedData.quantity !== undefined) {
      updatedData.stockStatus = this.autoCalculateStockStatus(updatedData.quantity);
    }

    // Update products
    const newInventory = [...this.inventory];
    newInventory[itemIndex] = { ...newInventory[itemIndex], ...updatedData };
    this.inventorySubject.next(newInventory);
    return { success: true, message: 'Item updated successfully!' };
  }

  /**
   * Delete the goods by name
   */
  deleteItemByName(itemName: string): { success: boolean; message: string } {
    const originalLength = this.inventory.length;
    const newInventory = this.inventory.filter(i => i.itemName.trim() !== itemName.trim());

    if (newInventory.length === originalLength) {
      return { success: false, message: 'Item not found!' };
    }

    this.inventorySubject.next(newInventory);
    return { success: true, message: 'Item deleted successfully!' };
  }

  /**
   * Search for products by name
   */
  searchItems(keyword: string): Item[] {
    const lowerKeyword = keyword.trim().toLowerCase();
    return this.inventory.filter(i => i.itemName.toLowerCase().includes(lowerKeyword));
  }

  /**
   * Get popular products
   */
  getPopularItems(): Item[] {
    return this.inventory.filter(i => i.isPopular);
  }

  /**
   * Get all categories
   */
  getAllCategories(): string[] {
    return ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  }
}