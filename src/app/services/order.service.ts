import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  url: string = 'http://localhost:8089';

   private getHeaders(): HttpHeaders {
       const token = localStorage.getItem('token');
       let header = 
           new HttpHeaders({
             'Authorization': `Bearer ${token}`,
           })
           console.log(token);
           
           console.log(header);
           
       return header;
     }
  
  constructor(private http: HttpClient) { }

  addAddress(data: any): Observable<any> {
    const headers = this.getHeaders(); 
    const url = `${this.url}/order/place`;  
    return this.http.post(url, data, { headers }); 
  }

  getOrder() :Observable<any>{
    const headers=this.getHeaders();
    const url=`${this.url}/orders/user`;
    return this.http.get(url,{headers})
  }

  cancelOrder(orderId: number) {
    const header = this.getHeaders();  
    return this.http.patch(`http://localhost:8089/orders/${orderId}/cancel`, {
    headers: header,
  });
}

}
