import {
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Cropper from 'cropperjs';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from '../../../../environments/environment';
import { DataService } from '../../../services/data.service';
import { Category } from 'src/app/interface/category';

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
        private _toastService: ToastService
    ) { }

    isLoading = false;

    firebaseApp = initializeApp(environment.firebaseConfig);
    categories: Category[] = [];
    storage = getStorage(this.firebaseApp);

    productForm: FormGroup;
    numRegex = /\d+$/;
    base64: any[] = [];
    targetUrl = '';

    targetImg: string;

    ngOnInit(): void {
        this.productForm = new FormGroup({
            title: new FormControl('', Validators.required),
            category: new FormControl('', Validators.required),
            warrantyInformation: new FormControl('', Validators.required),
            shippingInformation: new FormControl('', Validators.required),
            returnPolicy: new FormControl('', Validators.required),
            price: new FormControl(null, [
                Validators.required,
                Validators.pattern(this.numRegex),
            ]),
            discountPercentage: new FormControl(null, [
                Validators.required,
                Validators.pattern(this.numRegex),
                Validators.max(100),
            ]),
            stock: new FormControl(null, [
                Validators.required,
                Validators.pattern(this.numRegex),
            ]),
            description: new FormControl('', Validators.required),
            image: new FormControl([], Validators.required),
        });
        this.data.getCategories().subscribe({
            next: (res: any) => {
                this.categories = res
                console.log('res', res)
            },
            error: (error: Error) => {
                console.log(error)
            }
        });
    }

    angularCropperHandler(event: Event) {
        this.base64.push(event);
    }

    formHandler() {
        this.isLoading = true;
        let formValue = {
            ...this.productForm.value,
            price: +this.productForm.value['price'],
            stock: +this.productForm.value['stock'],
        };
        let img: string[] = [];
console.log('formValue', formValue)
        const uploadImages = this.base64.map((base) => {
            const refStorage = ref(this.storage, `images/${formValue.title}+${Date.now()}`);
            return uploadBytes(refStorage, base)
                .then((snapshot) => getDownloadURL(snapshot.ref));
        });

        Promise.all(uploadImages)
            .then((downloadURLs) => {
                img = downloadURLs;
                console.log(downloadURLs);

                let prodObj = {
                    ...formValue,
                    images: img,
                };

                this.data.uploadProduct(prodObj).subscribe({
                    next: res => {
                        this.isLoading = false;
                        this._toastService.show('Product Added Successfully!', 'bg-success');
                    },
                    error: error => {
                        this.isLoading = false;
                        this._toastService.show('Failed To Add Product. Please Try Again Later!', 'bg-danger');
                    },
                });
            });
    }
}
