import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  books:any[]=[];

  cartProducts:any[]=[];
  cartSubject=new Subject();
 
  url: string = 'http://localhost:8089';

  customerId:number | undefined;

 constructor(private http: HttpClient) {
   let userId = localStorage.getItem('userId');
   if (userId) {
     this.customerId = parseInt(userId);
     console.log(this.customerId);
   } else {
     console.error("User ID not found");
   }
 }
 private getHeaders(): HttpHeaders {
     const token = localStorage.getItem('token');
     let header = 
         new HttpHeaders({
           'Authorization': `Bearer ${token}`,
         })
     return header;
   }
   addToCart(bookId: number, quantity: number): Observable<any> {
    const headers = this.getHeaders(); // Get the Authorization header
    const url = `${this.url}/carts/add`; // Endpoint URL
    // Pass bookId and quantity as query parameters
    const params = {
      bookId: bookId.toString(),
      quantity: quantity.toString(),
    };
  
    // Send the POST request
    return this.http.post(url, null, { headers, params });
  }

      getCartById() {
        const header = this.getHeaders();  
      return this.http.get('http://localhost:8089/carts/user', {
        headers: header,
      });
      }

   updateCartQuantity(cartId: number, selectedQuantity: any) {
    const header = this.getHeaders();  
    return this.http.put(`${this.url}/carts/${cartId}/update-quantity`, {
      headers: header,
    });
  }

  unCart(cartId: any) {
    const header = this.getHeaders();  
    return this.http.delete(`${this.url}/carts/${cartId}/remove`, {
      headers: header,
    });
  }
}
