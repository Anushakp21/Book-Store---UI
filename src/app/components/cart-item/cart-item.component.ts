import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { AddressService } from 'src/app/services/address.service';
import { BookService } from 'src/app/services/book.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit  {


  cartItems:any[]=[];
  totalPrice: number = 0;
  cartCount: number | undefined;
  books: any[] = []
  totalQuantity: number = 0;
  detailedCartItems:any[] =[]
  isStepperVisible: boolean = false;
  isAddressSubmitted = false; // Track if the address form is submitte
  @ViewChild('addressSection') addressSection!: ElementRef;
  totalPayableAmount: any;

  constructor(
    private fb:FormBuilder,
    private router: Router,
    private cartService: CartService,
    private matSnackBar: MatSnackBar,
    private bookService: BookService,
    private sharedService: SharedService,
    private addressService: OrderService
  ) {}

  addressForm!: FormGroup<{
    streetAddress: FormControl<string | null>;
    city: FormControl<string | null>;
    state: FormControl<string | null>;
    country: FormControl<string | null>;
    pincode: FormControl<string | null>; 
    addressType: FormControl<string | null>;
  }>;
  
  
  addressTypes: string[] = ['OTHER', 'OFFICE', 'SHOP', 'HOME', 'INDUSTRY'];
  isAddressformsubmitted=false;
  isClicked: boolean = false;
  userName: string | null = null;
  quantity: number = 1;
  showAddressSection = false;
  newAddress: any = null;
  location: string = '';

  ngOnInit() {
    this.getCartItems();
    this.fetchCartCount();
    this.addressForm = this.fb.group({
      streetAddress: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', [Validators.required, Validators.maxLength(50)]],
      pincode: ['', [Validators.required]],
      addressType: ['', Validators.required],
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  
  getCartItems() {
    // Fetch cart items
    this.cartService.getCartById().subscribe({
      next: (cartRes: any) => {
        console.log('Cart Response:', cartRes);
        this.cartItems = cartRes;
        this.bookService.getAllBooks().subscribe({
          next: (bookRes: any[]) => {
            console.log('Book Response:', bookRes);
            this.detailedCartItems = this.cartItems.map((cartItem) => {
              const book = bookRes.find((b) => b.bookId === cartItem.bookId);
              return {
                ...cartItem,      
                bookDetails: book
              };
            });
            console.log('Detailed Cart Items:', this.detailedCartItems);
          },
          error: (err: any) => {
            console.error('Error fetching books:', err);
          }
        });
      },
      error: (err: any) => {
        console.error('Error fetching cart items:', err);
      }
    });
  }
  fetchCartCount(): void {
    this.cartService.getCartById().subscribe(
      (response: any) => {
        if (response && Array.isArray(response)) {
          console.log(response)
          const validItems = response
          this.cartCount = validItems.length;
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching cart count:', error);
      }
    );
  }


  changeQuantity(cartId: number, change: number): void {
    const cartItem = this.detailedCartItems.find(item => item.cartId === cartId);
  
    if (cartItem && cartItem.quantity + change > 0) {
      cartItem.quantity += change;
      const bookPrice = cartItem.bookDetails.price; 
      cartItem.totalPrice = bookPrice * cartItem.quantity;
      this.cartService.updateCartQuantity(cartId, cartItem.quantity).subscribe(
        (response: any) => {
          console.log(response);
          if (response.status === 200) {
            this.getCartItems(); 
            this.matSnackBar.open('Quantity updated successfully', 'Close', {
              duration: 3000,
            }); 
            this.totalPrice=response.totalPrice;
            this.totalQuantity=response.totalQuantity;
          } else {
            console.error('Failed to update quantity:', response.message);
            this.matSnackBar.open('Failed to update quantity', 'Close', {
              duration: 3000,
            });
          }
        },
        (error) => {
          console.error('Error updating quantity:', error);
          this.matSnackBar.open('Error updating quantity', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }
  
  unCart(cartId: number) {
    this.cartService.unCart(cartId).subscribe(
      (response: any) => {
        this.sharedService.updateCartCount(); //error
        this.fetchCartCount();
        console.log(response)
        if (response) {
          this.matSnackBar.open('Item removed from cart', 'Close', {
            duration: 3000,
          });
          this.getCartItems(); 
        } else {
          console.error('Failed to remove item from cart:', response.message);
          this.matSnackBar.open('Failed to remove item from cart', 'Close', {
            duration: 3000,
          });
        }
      },
      (error) => {
        console.error('Error removing item from cart:', error);
        this.matSnackBar.open('Error removing item from cart', 'Close', {
          duration: 3000,
        });
      }
    );
  }
  get f() {
    return this.addressForm.controls;
  }

  onAddAddress() {
    this.isStepperVisible=true;
    }
  getErrorMessage(controlName: string): string {
    const control = this.addressForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.getError('maxlength')?.requiredLength;
      return `${controlName} must not exceed ${maxLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return `${controlName} is invalid`;
    }
    return '';
  }
  onSubmitAddress(): void {
    if (this.addressForm.valid) {
      const addressData = this.addressForm.value; // This will include address fields
      const requestBody = { address: addressData }; // Construct the body to match API expectations
  
      console.log('Request Body:', requestBody);
      this.addressService.addAddress(requestBody).subscribe(
        (response) => {
          console.log('Response:', response);
          console.log(response.address.addressId)
          localStorage.setItem("addressId",response.address.addressId)

          this.isAddressformsubmitted=true;

          this.totalPrice = this.detailedCartItems.reduce(
            (sum, item) => sum + (item.bookDetails.price * item.quantity),
            0
          );
          this.totalQuantity = this.detailedCartItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
  
          // Update totalPayableAmount (can apply discount logic here)
          this.totalPayableAmount = this.totalPrice;
  
          console.log('Total Quantity:', this.totalQuantity);
          console.log('Total Price:', this.totalPrice);
          console.log('Total Payable Amount:', this.totalPayableAmount);
          this.matSnackBar.open('Address Added Successfully!', 'Close', {
            duration: 3000,
          });
          
        },
        (error) => {
          console.error('Error:', error);
          this.matSnackBar.open('Please fill out the form correctly.', 'Close', {
            duration: 3000,
          });
        }
      );
      } 
      else{
        console.log('invalid form ')
      }
  } 

  placeOrder() {
    this.router.navigateByUrl('/order-confirm')
    }
}

