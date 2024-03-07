import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastService } from '../components/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private firestore: AngularFirestore, private router: Router, private _toastService: ToastService) {}

  getProducts() {
    return this.firestore.collection('products').valueChanges();
  }

  deleteProduct(id: number) {
    // this.firestore
    //   .collection('products', (ref) => ref.where('id', '==', id))
    //   .get()
    //   .subscribe((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       doc.ref.delete().then(() => {
    //         //console.log('deleted');
    //         this._toastService.show('Product Deleted Successfully!','bg-success text-white fw-bolder')
    //       }).catch(()=>{
    //         this._toastService.show('Product Cannot Be Deleted. Try Again Later!','bg-success text-white fw-bolder')
    //       })
    //     });
    //   });


    this._toastService.show('Only Admin Can Perform this operation!', 'bg-danger text-white fw-bolder')
  }

  getProductById(pid: string) {
    return this.firestore
      .collection('products', (ref) => ref.where('id', '==', pid))
      .valueChanges();
  }

  updateProduct(pid, data: {}) {
    // this.firestore
    //   .collection('products', (ref) => ref.where('id', '==', pid))
    //   .get()
    //   .subscribe((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       doc.ref.update(data).then(() => {
    //         //console.log('updated');
    //         this.router.navigate(['admin']);
    //       });
    //     });
    //   });
    this._toastService.show('Only Admin Can Perform this operation!', 'bg-danger text-white fw-bolder')

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
