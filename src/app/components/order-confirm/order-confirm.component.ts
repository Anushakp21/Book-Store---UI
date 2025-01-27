import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.css']
})
export class OrderConfirmComponent implements OnInit {

orderId: any;
address: any;

constructor(private Router:Router,private orderService:OrderService){}
continue() {
  this.Router.navigateByUrl('/home');
  }

  ngOnInit() {
    this.orderService.getOrder().subscribe((response) => {
      console.log(response);
  
      if (response && response.length > 0) {
        const lastOrder = response[response.length - 1]; // Get the last placed order
  
        this.orderId = lastOrder.orderId; // Access the orderId from the last order
  
        if (lastOrder.address) {
          this.address =
            lastOrder.address.streetAddress + ', ' +
            lastOrder.address.city + ', ' +
            lastOrder.address.state + ', ' +
            lastOrder.address.country + ' - ' +
            lastOrder.address.pincode;
        } else {
          console.error("Address is undefined for the last order.");
          this.address = 'Address not available';
        }
      } else {
        console.error("No orders found.");
        this.address = 'No orders found';
      }
    }, (error) => {
      console.error("Error fetching orders:", error);
    });
  }

}
