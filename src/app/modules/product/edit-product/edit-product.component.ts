import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Cropper from 'cropperjs';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Category } from 'src/app/interface/category';
import { Product } from 'src/app/interface/product';
import { GeneralService } from 'src/app/services/general.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';
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
    selector: 'app-edit-product',
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class EditProductComponent implements OnInit {
    isLoading = false;
    base64: any;
    @ViewChild('cropperJsRoot') cropperJsRoot: ElementRef;
    imageEditMode: boolean = false

    // targetImg: any;

    productId = '';
    product: Product;
    numRegex = /\d+$/;

    categoryList: Category[] = [];
    firebaseApp = initializeApp(environment.firebaseConfig);
    storage = getStorage(this.firebaseApp);

    productForm: FormGroup;
    constructor(
        private _route: ActivatedRoute,
        private data: DataService,
        private _toastService: ToastService,
        private genrealService: GeneralService,
        private router: Router) {

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
                image: new FormControl('', Validators.required),
            });
    }

    ngOnInit(): void {
        this._route.params.subscribe((params) => {
            this.isLoading = true
            this.data.getProductById(params['id']).subscribe({
                next: (res: Product) => {
                    console.log(res);
                    
                    // this.targetImg = res.images[0];
                    this.product = res;

                    this.data.getCategories().subscribe((res: Category[]) => {
                        this.categoryList = res;
                        this.isLoading = false
                    });

                    this.productForm.patchValue({
                        ...res,
                        title: res.title,
                        category: res.category,
                        price: +res.price,
                        stock: +res.stock,
                    });
                },
                error: error => {
                    this._toastService.show(error.error.error, 'bg-danger mt-5 text-white fw-bolder')
                    this.router.navigate(['/'])
                }
            });

        });

    }

    imageUploader = async (title) => {
        const refStorage = ref(this.storage, `images/${title}`);

        return uploadBytes(refStorage, this.base64)
            .then((snapshot) => {
                return getDownloadURL(snapshot.ref);
            })
    }

    async formHandler() {
        this.genrealService.showLoader(true)
        let img: string[] = [];

        let formValue = {
            ...this.product,
            ...this.productForm.value,
            price: +this.productForm.value['price'],
            stock: +this.productForm.value['stock'],
        };

        if (this.base64) {
            await this.imageUploader(formValue.title).then(res => {
                img.push(res);
            })
        } else {
            img = [...this.product.images]
        }


        let prodObj = {
            ...formValue,
            images: img,
            _id: this.product._id,
        };
        this.data.updateProduct(this.product['_id'], prodObj).subscribe({
            next: res => {
                this.isLoading = false
                this.genrealService.showLoader(false)

                this._toastService.show('Product Updated Successfully!', 'bg-success mt-5 text-white fw-bolder')

            },
            error: err => {
                this.genrealService.showLoader(false)
                this._toastService.show('Product Cannot Be Edited. Please Try Again Later!', 'bg-danger text-white fw-bolder')
            },

        })



    }

    angularCropperHandler(event: Event) {
        this.base64 = event;
    }
}
