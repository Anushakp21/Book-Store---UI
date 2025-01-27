import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';
import { OrderService } from 'src/app/services/order.service';
import { Book } from 'src/app/models/book.model';
import { Order } from 'src/app/models/order.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {


orders: any[]=[];

constructor(private orderService: OrderService, private router: Router,private bookService:BookService, private matSnackBar: MatSnackBar,) {}

ngOnInit(): void {
  this.getOrderData();
}

getOrderData() {
  this.orderService.getOrder().subscribe(
    (response: any) => {
      if (response) {
        this.orders = response.map((order: any) => {
          
          const address =  `${order.address?.streetAddress || ''}, ${order.address?.city || ''}, 
          ${order.address?.state || ''}, ${order.address?.pincode || ''}, 
          ${order.address?.country || ''}`.trim();

          this.bookService.getAllBooks
          const books = (order.books || []).map((book: any) => ({
            bookImage: book.bookImage || '',
            bookTitle: book.bookName || '',
            bookAuthor: book.authorName || '',
            bookPrice: book.price || 0,
          }));

          return {
            orderId: order.orderId || '',
            totalQuantity: order.quantity || 0,
            totalPrice: order.price || 0,
            totalPayableAmount: order.price || 0,
            address: address,
            books: books,
          };
        });
        console.log(this.orders);
        
      }
    },
    (error) => {
      console.error('Error fetching orders:', error);
    }
  );
}
cancelOrder(orderId: number) {
  this.orderService.cancelOrder(orderId).subscribe(
    (response: any) => {
      console.log('Order canceled successfully:', response);
      this.getOrderData(); 
      this.matSnackBar.open('Order cancelled successfully!', 'Dismiss', {
        duration: 2000,
      });
    },
    (error) => {
      console.error('Error canceling order:', error);
    }
  );
}

continue() {
  this.router.navigateByUrl('/home');
  }


}
