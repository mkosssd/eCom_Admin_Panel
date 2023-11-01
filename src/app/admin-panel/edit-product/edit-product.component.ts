import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CropperComponent } from 'angular-cropperjs';
import Cropper from 'cropperjs';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { environment } from 'src/enviroments/enviroments';
import { SuperImageCropper } from 'super-image-cropper';
import { DataService } from '../data.service';

export interface ImageCropperSetting {
  width: number;
  height: number;
}
export interface ImageCropperResult {
  imageData: Cropper.ImageData;
  cropData: Cropper.CropBoxData;
  blob?: Blob;
  dataUrl?: string;
}
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditProductComponent implements OnInit {
  isLoading = false;
  base64: any;
  @ViewChild('cropperJsRoot') cropperJsRoot: ElementRef;

  targetImg: any;

  productForm: FormGroup;
  constructor(private actRoute: ActivatedRoute, private data: DataService) {}

  productId = '';
  product: any;
  numRegex = /\d+$/;

  list = [];
  firebaseApp = initializeApp(environment.firebaseConfig);
  storage = getStorage(this.firebaseApp);

  ngOnInit(): void {
    this.isLoading=true
    this.actRoute.params.subscribe((res) => (this.productId = res['id']));

    this.productForm = new FormGroup({
      title: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      price: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.numRegex),
      ]),
      stock: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.numRegex),
      ]),
    });
    this.data.getProductById(this.productId).subscribe((res: any) => {
      this.targetImg = res[0].images[0];
      this.product = res;
      this.productForm.patchValue({
        title: res[0].title,
        category: res[0].category,
        price: +res[0].price,
        stock: +res[0].stock,
      });
    });
    this.data.getCategories().subscribe((res: any) => {
      this.list = Object.values(res);
      this.isLoading=false
    });
  }

  formHandler() {
    this.isLoading=true
    let formValue = {
      ...this.productForm.value,
      price: +this.productForm.value['price'],
      stock: +this.productForm.value['stock'],
    };
    const refStorage = ref(this.storage, `images/${formValue.title}`);
    let img: string[] = [];

    uploadBytes(refStorage, this.base64)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        img.push(downloadURL);
      })
      .then(() => {
        let prodObj = {
          ...formValue,
          images: img,
          id: this.productId,
        };
        this.data.updateProduct(this.product[0]['id'], prodObj);
      }).then(()=>{
        this.isLoading=false
      });
  }
  angularCropperHandler(event: Event) {
    this.base64 = event;
  }
}
