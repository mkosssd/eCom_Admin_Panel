import {ChangeDetectionStrategy, Component, Input,OnInit} from "@angular/core";import { DataService } from '../data.service';
import { Product } from 'src/app/shared/cart-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  productsList: Product[];
  constructor(private data: DataService, private router: Router) { }
  pageId: number = 1;
  isLoading: boolean = false;
  totalPages: number;
  pagesArray: number[];
  indexArray: number[];
  ngOnInit(): void {
    this.data.getProducts().subscribe((res: Product[]) => {
      this.productsList = res;
      console.log(res[0]);
      this.totalPages = Math.ceil(this.productsList.length / 10);
      console.log(this.totalPages);
      
      this.pagesArray = Array.from(
        { length: this.totalPages },
        (_, i) => i + 1
      );

      this.indexArray = [];
      this.pagesArray.map((page) => this.indexArray.push((page - 1) * 10));
    });
  }
  editProduct(pid: number) {
    this.router.navigate([`admin/edit-product/${pid}`]);
  }
  deleteProduct(pid: number, i: number) {
    this.productsList.splice(i, 1);
    this.data.deleteProduct(pid);
  }
  page: number = 1;
}
