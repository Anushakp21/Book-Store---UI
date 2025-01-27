import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './components/signup/signup.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './components/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import {MatStepperModule} from '@angular/material/stepper';
import { OrderConfirmComponent } from './components/order-confirm/order-confirm.component';
import { OrdersComponent } from './components/orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    CartComponent,
    CartItemComponent,
    SidePanelComponent,
    WishlistComponent,
    OrderConfirmComponent,
    OrdersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,MatDatepickerModule,MatNativeDateModule,MatSelectModule,BrowserAnimationsModule,
    MatButtonModule,HttpClientModule,MatIconModule,MatMenuModule,MatBadgeModule,MatSnackBarModule,MatStepperModule
  ],
  
  providers: [  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
