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

/**
 * Add new item functionality with complete data validation
 * @param item The item object to be added
 * @returns Whether the addition was successful
 */
export function addItem(item: Item): boolean {
  // 1. Verify the uniqueness of the Item ID
  const isIdExists = inventory.some(existingItem => existingItem.itemId === item.itemId);
  if (isIdExists) {
    showMessage('Error: Item ID already exists!', true);
    return false;
  }

  // 2. Verification required fields
  if (!item.itemId || !item.itemName || !item.category || !item.supplierName) {
    showMessage('Error: All required fields must be filled!', true);
    return false;
  }

  // 3. Verify that the numeric field is non-negative
  if (item.quantity < 0 || item.price < 0) {
    showMessage('Error: Quantity and price cannot be negative!', true);
    return false;
  }

  // 4. Automatically calculate inventory status
  item.stockStatus = autoCalculateStockStatus(item.quantity);

  // 5. Add to the inventory array
  inventory.push(item);
  showMessage('Item added successfully!');

  // 6. 6. Re-render the list
  renderAllItems();
  renderPopularItems();
  return true;
}

/**
 * Update item information by item name
 * @param itemName The name of the item to be updated
 * @param updatedData The field data to be updated
 * @returns Whether the update was successful
 */
export function updateItemByName(itemName: string, updatedData: Partial<Item>): boolean {
  // 1. Search for commodity index
  const itemIndex = inventory.findIndex(item => item.itemName.trim() === itemName.trim());
  if (itemIndex === -1) {
    showMessage('Error: Item not found!', true);
    return false;
  }

  // 2. Verify that the numeric field is non-negative (if the quantity/price has been updated)
  if (updatedData.quantity !== undefined && updatedData.quantity < 0) {
    showMessage('Error: Quantity cannot be negative!', true);
    return false;
  }
  if (updatedData.price !== undefined && updatedData.price < 0) {
    showMessage('Error: Price cannot be negative!', true);
    return false;
  }

  //3. Automatically update inventory status (if the quantity is updated)
  if (updatedData.quantity !== undefined) {
    updatedData.stockStatus = autoCalculateStockStatus(updatedData.quantity);
  }

  // 4. Update product information
  inventory[itemIndex] = { ...inventory[itemIndex], ...updatedData };
  showMessage('Item updated successfully!');

  // 5. Re-render the list
  renderAllItems();
  renderPopularItems();
  return true;
}

/**
 * Delete item by item name with confirmation prompt
 * @param itemName The name of the item to be deleted
 * @returns Whether the deletion was successful
 */
export function deleteItemByName(itemName: string): boolean {
  // 1. Confirm deletion
  const isConfirmed = confirm('Are you sure you want to delete this item? This action cannot be undone.');
  if (!isConfirmed) return false;

  // 2. Search for and delete the product
  const originalLength = inventory.length;
  inventory = inventory.filter(item => item.itemName.trim() !== itemName.trim());

  //3. Verify whether the deletion was successful
  if (inventory.length === originalLength) {
    showMessage('Error: Item not found!', true);
    return false;
  }

  showMessage('Item deleted successfully!');
  // 4. Re-render the list
  renderAllItems();
  renderPopularItems();
  return true;
}

/**
 * Search for products by product name
 * @param keyword Search keywords
 * @returns Search keywords
 */
export function searchItemByName(keyword: string): Item[] {
  const lowerKeyword = keyword.trim().toLowerCase();
  return inventory.filter(item => item.itemName.toLowerCase().includes(lowerKeyword));
}

/**
 * Get all popular products
 * @returns Array of Popular products
 */
export function getPopularItems(): Item[] {
  return inventory.filter(item => item.isPopular);
}

/**
 * Render item list to page
 * @param items The array of items to be rendered
 * @param container The DOM container for rendering
 */
function renderItemList(items: Item[], container: HTMLElement): void {
  // Empty the container
  container.innerHTML = '';

  // Prompt when there is no data
  if (items.length === 0) {
    container.innerHTML = '<p class="empty-tip">No items to display</p>';
    return;
  }

  // Render the product card
  items.forEach(item => {
    container.innerHTML += `
      <div class="item-card">
        <div class="card-header">
          <h3>${item.itemName}</h3>
          <span class="item-id">ID: ${item.itemId}</span>
        </div>
        <div class="card-content">
          <p><strong>Category:</strong> ${item.category}</p>
          <p><strong>Quantity:</strong> ${item.quantity}</p>
          <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
          <p><strong>Supplier:</strong> ${item.supplierName}</p>
          <p><strong>Stock Status:</strong> <span class="status-${item.stockStatus.toLowerCase().replace(' ', '-')}">${item.stockStatus}</span></p>
          <p><strong>Popular Item:</strong> ${item.isPopular ? '✅ Yes' : '❌ No'}</p>
          ${item.comment ? `<p><strong>Comment:</strong> ${item.comment}</p>` : ''}
        </div>
      </div>
    `;
  });
}

/**
 * Render all items list
 */
export function renderAllItems(): void {
  renderItemList(inventory, ALL_ITEMS_CONTAINER);
}

/**
 * Render popular items list
 */
export function renderPopularItems(): void {
  const popularItems = getPopularItems();
  renderItemList(popularItems, POPULAR_ITEMS_CONTAINER);
}

/**
 * Handle search input and render search results in real-time
 * @param keyword Search keyword
 */
export function handleSearch(keyword: string): void {
  if (!keyword.trim()) {
    //When the key word is empty, re-render all the products
    renderAllItems();
    return;
  }
  const matchedItems = searchItemByName(keyword);
  renderItemList(matchedItems, ALL_ITEMS_CONTAINER);
}