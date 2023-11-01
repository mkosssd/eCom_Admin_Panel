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
import { CropperComponent } from 'angular-cropperjs';
import Cropper from 'cropperjs';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { SuperImageCropper } from 'super-image-cropper';
import { environment } from '../../../enviroments/enviroments';
import { AdminServiceService } from '../admin-service.service';
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
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddProductComponent implements OnInit {
  constructor(
    private data: DataService,
    private prodService: AdminServiceService
  ) {}

  isLoading = false;

  firebaseApp = initializeApp(environment.firebaseConfig);
  list = [];
  storage = getStorage(this.firebaseApp);

  productForm: FormGroup;
  numRegex = /\d+$/;
  base64;
  targetUrl = '';

  targetImg: string;

  ngOnInit(): void {
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
    this.data.getCategories().subscribe((res: any) => {
      this.list = Object.values(res);
    });
  }
  angularCropperHandler(event: Event) {
    this.base64 = event;
  }
  formHandler() {
    this.isLoading = true;
    let formValue = {
      ...this.productForm.value,
      price: +this.productForm.value['price'],
      stock: +this.productForm.value['stock'],
    };
    let img: string[] = [];

    const refStorage = ref(this.storage, `images/${formValue.title}`);

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
        };

        this.prodService.uploadProduct(prodObj);
      })
      .then(() => {
        this.isLoading = false;
      });
  }
}
