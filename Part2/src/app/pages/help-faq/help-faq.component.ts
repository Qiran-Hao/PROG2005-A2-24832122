import { Component } from '@angular/core';

@Component({
  selector: 'app-help-faq',
  templateUrl: './help-faq.component.html',
  styleUrls: ['./help-faq.component.css']
})
export class HelpFaqComponent {
  // 页面逻辑可以留空
  faqs = [
    {
      question: 'How do I add a new inventory item?',
      answer: 'Navigate to the "Manage Inventory" page, fill out all required fields in the "Add New Item" form (ID, Name, Category, Quantity, Price, Supplier), and click the "Add Item" button. Ensure the ID is unique and all numeric fields are non-negative.'
    },
    {
      question: 'How do I update an existing item?',
      answer: 'In the "Update Item" form on the Manage page, enter the exact name of the item you want to update. You can modify the quantity, price, and popular status. Click "Update Item" to apply changes.'
    },
    {
      question: 'Why is my item not found during update/delete?',
      answer: 'Please check the spelling of the item name. The search is case-insensitive but requires an exact match. Ensure there are no extra spaces in the item name.'
    },
    {
      question: 'How does the search functionality work?',
      answer: 'On the Search page, type any part of the item name in the search box. The list will filter in real-time to show only items that contain your search keyword.'
    },
    {
      question: 'What are the supported categories?',
      answer: 'The application supports five predefined categories: Electronics, Furniture, Clothing, Tools, and Miscellaneous.'
    },
    {
      question: 'Is my data saved permanently?',
      answer: 'No, this application runs entirely in the browser memory. All data is cleared when you close the browser tab. For permanent storage, this application would need a backend server and database.'
    },
    {
      question: 'How to make the application work on mobile devices?',
      answer: 'The application is fully responsive and will automatically adapt to different screen sizes. No additional setup is required on mobile devices.'
    }
  ];
}