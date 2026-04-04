/**
 * PROG2005 A2 Part1 - TypeScript Inventory System
 * Author: Hao Qiran 24832122
 * Description: Inventory management system implemented purely in TypeScript, with in-session data persistence.
 */

// Strong type interface for inventory goods, strictly restricting all field types and required fields
export interface Item {
  itemId: string;         // Unique identifier, non-repeatable
  itemName: string;       // Product name, add, delete, modify, check index
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous'; // Fixed classification enumeration
  quantity: number;        // The inventory quantity is not negative
  price: number;           // Product price, non-negative number
  supplierName: string;    // Supplier Name
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock'; // Inventory status enumeration
  isPopular: boolean;      // Is it a popular product?
  comment?: string;        // Note: The only optional field
}

// Global inventory array, strictly following the Item interface type
let inventory: Item[] = [];

// DOM element constants to avoid repeated acquisition and optimize performance
const MESSAGE_BOX = document.getElementById('message')!;
const ALL_ITEMS_CONTAINER = document.getElementById('all-items-container')!;
const POPULAR_ITEMS_CONTAINER = document.getElementById('popular-items-container')!;