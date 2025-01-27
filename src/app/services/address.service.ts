import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  getAddress() {
    throw new Error('Method not implemented.');
  }
  addAddress(addressData: Partial<{ streetAddress: string | null; streetAddressAdditional: string | null; city: string | null; state: string | null; area: string | null; zipcode: number | null; }>) {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
