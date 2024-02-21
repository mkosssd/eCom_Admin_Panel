import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private firestore: AngularFirestore, private router: Router) {}

  getProducts() {
    return this.firestore.collection('products').valueChanges();
  }

  deleteProduct(id: number) {
    this.firestore
      .collection('products', (ref) => ref.where('id', '==', id))
      .get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete().then(() => {
            //console.log('deleted');
          });
        });
      });
  }

  getProductById(pid: string) {
    return this.firestore
      .collection('products', (ref) => ref.where('id', '==', pid))
      .valueChanges();
  }

  updateProduct(pid, data: {}) {
    this.firestore
      .collection('products', (ref) => ref.where('id', '==', pid))
      .get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update(data).then(() => {
            //console.log('updated');
            this.router.navigate(['admin']);
          });
        });
      });
  }

  getCategories() {
    return this.firestore
      .collection('categories')
      .doc('UhXnpCPXIasl4tEGsBu7')
      .valueChanges();
  }

  setCategories(categories) {
    return this.firestore
      .collection('categories')
      .doc('UhXnpCPXIasl4tEGsBu7')
      .set(categories);
  }
}
