import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookService } from 'src/app/services/book.service';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  wishlistItems: any[] = [];
  detailedWishlistItems: any[] = [];
  wishlistCount: number = 0;
  Math: any;

  constructor(
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist(): void  {
    this.wishlistService.getWishList().subscribe({
      next: (wishlistResponse: any[]) => {
        console.log('Wishlist Response:', wishlistResponse);
        this.wishlistItems = wishlistResponse;
  
        this.bookService.getAllBooks().subscribe({
          next: (bookResponse: any[]) => {
            console.log('Books Response:', bookResponse);
  
            // Ensure that all wishlist items are included, even if no direct match for bookId
            this.detailedWishlistItems = this.wishlistItems.map((wishlistItem) => {
              // Find the book details corresponding to the wishlist item
              const book = bookResponse.find((b) => b.bookId === wishlistItem.bookId);
  
              // If book is found, associate the details, else set as undefined or placeholder
              return {
                ...wishlistItem,
                bookDetails: book || null,  // Handle case when no matching book is found
              };
            });
  
            // Update wishlist count
            this.wishlistCount = this.detailedWishlistItems.length;
            console.log('Detailed Wishlist Items:', this.detailedWishlistItems);
          },
          error: (err) => {
            console.error('Error fetching books:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error fetching wishlist items:', err);
      },
    });
  }

  removeFromWishlist(bookId: number): void {
    this.wishlistService.removeWishlistItem(bookId).subscribe({
      next: () => {
        this.snackBar.open('Item removed from wishlist successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.getWishlist();
      },
      error: (err) => {
        console.error('Error removing item from wishlist:', err);
        this.snackBar.open('Failed to remove item from wishlist.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  extractUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  addToCart(item: any): void {
    const userId = this.extractUserId();
    if (item && userId) {
      this.cartService.addToCart(item.bookDetails.bookId, 1).subscribe({
        next: (response: any) => {
          console.log('Item added to cart successfully:', response);
          this.snackBar.open('Item added to cart successfully!', '', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        },
        error: (err) => {
          console.error('Error adding item to cart:', err);
          this.snackBar.open('Failed to add item to cart. Please try again.', '', {
            duration: 3000,
          });
        },
      });
    } else {
      console.error('No item or user ID found for adding to cart.');
      this.snackBar.open('No item or user ID available for adding to cart.', '', {
        duration: 3000,
      });
    }
  }
}

