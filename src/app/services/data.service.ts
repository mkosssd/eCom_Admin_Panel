import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interface/product';
import { Category } from '../interface/category';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor(
        private firestore: AngularFirestore,
        private router: Router,
        private _toastService: ToastService,
        private http: HttpClient) { }

    getProducts() {
        return this.http.get(environment.API_EndPoint + 'products')
    }

    deleteProduct(id: string) {
        return this.http.delete(environment.API_EndPoint + 'products/' + id)
    }

    getProductById(pid: string) {
        return this.http.get(environment.API_EndPoint + 'products/' + pid)
    }

    updateProduct(pid: string, data: Product) {
        return this.http.put(environment.API_EndPoint + 'products/' + pid, data)
    }
    uploadProduct(prodObj: {}) {
        return this.http.post(environment.API_EndPoint+ 'products', prodObj)
    }

    getCategories() {
        return this.http.get(environment.API_EndPoint + 'categories')
    }

    setCategories(categoryData: Category) {
        return this.http.post(environment.API_EndPoint + 'categories', categoryData)
    }

    deleteCategory(id: string) {
        return this.http.delete(environment.API_EndPoint + 'categories/' + id)
    }
}
