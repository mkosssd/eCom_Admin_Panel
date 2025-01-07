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
    categories = [];
    storage = getStorage(this.firebaseApp);

    productForm: FormGroup;
    numRegex = /\d+$/;
    base64: any;
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
            this.categories = Object.values(res);
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

                this.data.uploadProduct(prodObj);
            })
            .then(() => {
                this.isLoading = false;
                this._toastService.show('Product Added Successfully!', 'bg-success')
            })
            .catch(() => {
                this._toastService.show('Failed To Add Product. Please Try Again Later!', 'bg-danger')
            })
    }
}
