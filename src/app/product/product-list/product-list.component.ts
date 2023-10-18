import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];
  filteredProducts: Product[] = []
  sortOrder: string = ""

  constructor(
            private productService: ProductService, 
            private cartService: CartService,
            private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      console.log(this.products);
      this.filteredProducts = products;
    })
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        this.snackbar.open(product.name + " added to cart", "", {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        })
      }
    });
  }

  applyFilter(event: Event): void {
    let searchTerm = (event.target as HTMLInputElement).value;
    searchTerm = searchTerm.toLowerCase();

    this.filteredProducts = this.products.filter(
      product => product.name.toLowerCase().includes(searchTerm)
    )

    this.sortProducts(this.sortOrder)
  }

  sortProducts(sortValue: string){
    this.sortOrder = sortValue;

    if(this.sortOrder === "priceLowHigh"){
      this.filteredProducts.sort((a,b) => a.price - b.price)
    } else if(this.sortOrder === "priceHighLow"){
      this.filteredProducts.sort((a,b) => b.price - a.price)
    }
  }
}
