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
 * 新增商品功能，包含完整数据校验
 * @param item 待新增的商品对象
 * @returns 新增是否成功
 */
export function addItem(item: Item): boolean {
  // 1. 校验Item ID唯一性
  const isIdExists = inventory.some(existingItem => existingItem.itemId === item.itemId);
  if (isIdExists) {
    showMessage('Error: Item ID already exists!', true);
    return false;
  }

  // 2. 校验必填项（除comment外所有字段必填）
  if (!item.itemId || !item.itemName || !item.category || !item.supplierName) {
    showMessage('Error: All required fields must be filled!', true);
    return false;
  }

  // 3. 校验数字字段非负
  if (item.quantity < 0 || item.price < 0) {
    showMessage('Error: Quantity and price cannot be negative!', true);
    return false;
  }

  // 4. 自动计算库存状态（超越HD标准）
  item.stockStatus = autoCalculateStockStatus(item.quantity);

  // 5. 新增到库存数组
  inventory.push(item);
  showMessage('Item added successfully!');

  // 6. 重新渲染列表
  renderAllItems();
  renderPopularItems();
  return true;
}

/**
 * 按商品名称更新商品信息（作业强制要求）
 * @param itemName 待更新的商品名称
 * @param updatedData 待更新的字段数据
 * @returns 更新是否成功
 */
export function updateItemByName(itemName: string, updatedData: Partial<Item>): boolean {
  // 1. 查找商品索引
  const itemIndex = inventory.findIndex(item => item.itemName.trim() === itemName.trim());
  if (itemIndex === -1) {
    showMessage('Error: Item not found!', true);
    return false;
  }

  // 2. 校验数字字段非负（如果更新了数量/价格）
  if (updatedData.quantity !== undefined && updatedData.quantity < 0) {
    showMessage('Error: Quantity cannot be negative!', true);
    return false;
  }
  if (updatedData.price !== undefined && updatedData.price < 0) {
    showMessage('Error: Price cannot be negative!', true);
    return false;
  }

  // 3. 自动更新库存状态（如果更新了数量）
  if (updatedData.quantity !== undefined) {
    updatedData.stockStatus = autoCalculateStockStatus(updatedData.quantity);
  }

  // 4. 更新商品信息
  inventory[itemIndex] = { ...inventory[itemIndex], ...updatedData };
  showMessage('Item updated successfully!');

  // 5. 重新渲染列表
  renderAllItems();
  renderPopularItems();
  return true;
}

/**
 * 按商品名称删除商品，带确认提示（作业强制要求）
 * @param itemName 待删除的商品名称
 * @returns 删除是否成功
 */
export function deleteItemByName(itemName: string): boolean {
  // 1. 确认删除
  const isConfirmed = confirm('Are you sure you want to delete this item? This action cannot be undone.');
  if (!isConfirmed) return false;

  // 2. 查找并删除商品
  const originalLength = inventory.length;
  inventory = inventory.filter(item => item.itemName.trim() !== itemName.trim());

  // 3. 校验是否删除成功
  if (inventory.length === originalLength) {
    showMessage('Error: Item not found!', true);
    return false;
  }

  showMessage('Item deleted successfully!');
  // 4. 重新渲染列表
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