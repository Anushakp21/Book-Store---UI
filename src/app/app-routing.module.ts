import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { OrderConfirmComponent } from './components/order-confirm/order-confirm.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AuthGuardService } from './auth/auth-guard.service';


const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'signup', component:SignupComponent},
  {path:'login', component:LoginComponent},
  {path:'header', component:HeaderComponent},
  {path:'cart', component:CartComponent},
  {path:'cart-item', component:CartItemComponent,canActivate:[AuthGuardService],data:{roles:['USER']}},
  {path:'wishlist',component:WishlistComponent,canActivate:[AuthGuardService],data:{roles:['USER']}},
  {path:'order-confirm',component:OrderConfirmComponent,canActivate:[AuthGuardService],data:{roles:['USER']}},
  {path:'order',component:OrdersComponent,canActivate:[AuthGuardService],data:{roles:['USER']}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
