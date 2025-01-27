import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  customerId:number | undefined;

  url: string = 'http://localhost:8089';

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
     addToWishList(bookId: number): Observable<any> {
      const headers = this.getHeaders(); // Get the Authorization header
      const url = `${this.url}/wishlist/add/${bookId}`; // Endpoint URL
      const params = {
        bookId: bookId.toString(),
      };
    
      // Send the POST request
      return this.http.post(url, null, { headers, params });
    }

    getWishList():Observable<any[]> {
      const header = this.getHeaders();  
      return this.http.get<any[]>('http://localhost:8089/wishlist/getAllItems', {
      headers: header,
    });
    }

    removeWishlistItem(bookId: number) {
      const header = this.getHeaders();  
      return this.http.delete(`http://localhost:8089/wishlist/cancel/${bookId}`, {
      headers: header,
    });
  }
}
