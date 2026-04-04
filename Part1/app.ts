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

/**
 * Message prompt function, replacing alert()
 * @param msg Prompt text
 * @param isError Is it an error prompt? The default is false
 */
function showMessage(msg: string, isError: boolean = false): void {
  MESSAGE_BOX.innerText = msg;
  MESSAGE_BOX.style.color = isError ? '#dc2626' : '#16a34a';
  // The prompt will be automatically cleared after 3 seconds
  setTimeout(() => {
    MESSAGE_BOX.innerText = '';
  }, 3000);
}

/**
 * Automatically calculate inventory status
 * @param quantity Inventory quantity
 * @returns The corresponding inventory status
 */
function autoCalculateStockStatus(quantity: number): Item['stockStatus'] {
  if (quantity <= 0) return 'Out of Stock';
  if (quantity < 5) return 'Low Stock';
  return 'In Stock';
}

/**
 * Initialize the default test data and execute it when the page is loaded
 */
function initInventoryData(): void {
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
  inventory = defaultItems;
  // Render all lists after initialization
  renderAllItems();
  renderPopularItems();
}

// Initialization is executed after the page is fully loaded
window.onload = () => {
  initInventoryData();
};