/**
 * PROG2005 A2 Part2 - Item Interface
 * Author:Hao Qiran 24832122
 * Description: Strongly-typed interface for inventory goods
 */
export interface Item {
  itemId: string;
  itemName: string;
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  isPopular: boolean;
  comment?: string;
}