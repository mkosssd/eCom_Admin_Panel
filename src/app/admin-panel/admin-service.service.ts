import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AdminServiceService {
  constructor(private firestore: AngularFirestore, private router: Router) {}
  uploadProduct(prodObj: {}) {
    this.firestore
      .collection('products')
      .add({
        ...prodObj,
        id: this.firestore.createId(),
      })
      .then(() => {
        //console.log('Success');
        this.router.navigate(['/']);
      })
      .catch((err) => {
        //console.log(err);
      });
  }
}
