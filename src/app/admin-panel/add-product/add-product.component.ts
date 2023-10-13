import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
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
export class AddProductComponent implements OnInit, OnDestroy {
  constructor(
    private data: DataService,
    private prodService: AdminServiceService
  ) {}
  @ViewChild('angularCropper') public angularCropper: CropperComponent;
  @ViewChild('image', { static: true }) image: ElementRef;

  @Input() imageUrl: any;
  @Input() settings: ImageCropperSetting;
  @Input() cropbox: Cropper.CropBoxData;
  @Input() loadImageErrorText: string;
  @Input() cropperOptions: any = {};

  @Output() export = new EventEmitter<ImageCropperResult>();
  @Output() ready = new EventEmitter();

  public isLoading: boolean = true;
  public cropper: Cropper;
  public imageElement: HTMLImageElement;
  public loadError: any;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  productForm: FormGroup;
  numRegex = /\d+$/;
  file: any;
  base64;
  targetUrl = '';
  firebaseApp = initializeApp(environment.firebaseConfig);
  isGif = false;
  @ViewChild('cropperJsRoot') cropperJsRoot: ElementRef;

  cropperInstance: Cropper;
  targetGif: string;
  superImageCropperInstance: SuperImageCropper;
  croppedImageList: string[] = [];

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

  list = [];

  onGifUpload(event: any): void {
    this.croppedImage = '';
    this.targetGif = '';
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.targetGif = reader.result as string;
    };
  }

  storage = getStorage(this.firebaseApp);

  ngOnDestroy() {
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
  }

  imageLoadedS(ev: Event) {
    this.loadError = false;

    const image = ev.target as HTMLImageElement;
    this.imageElement = image;

    if (this.cropperOptions.checkCrossOrigin) image.crossOrigin = 'anonymous';

    image.addEventListener('ready', () => {
      this.ready.emit(true);

      this.isLoading = false;

      if (this.cropbox) {
        this.cropper.setCropBoxData(this.cropbox);
      }
    });

    let aspectRatio = NaN;
    if (this.settings) {
      const { width, height } = this.settings;
      aspectRatio = width / height;
    }

    this.cropperOptions = {
      ...{
        aspectRatio,
        checkCrossOrigin: true,
      },
      ...this.cropperOptions,
    };

    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = undefined;
    }

    this.cropper = new Cropper(image, this.cropperOptions);
  }

  imageLoadError(event: any) {
    this.loadError = true;
    this.isLoading = false;
  }

  exportCanvas(base64?: any) {
    const imageData = this.cropper.getImageData();
    const cropData = this.cropper.getCropBoxData();
    const canvas = this.cropper.getCroppedCanvas();
    const data = { imageData, cropData };

    const promise = new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], 'png', {
          type: blob.type,
        });
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64data = reader.result;
          this.croppedImage = base64data;
          this.base64 = file;
        };
        reader.onerror = () => {};
        reader.readAsDataURL(file);
      });
    });

    promise.then((res: any) => {
      this.export.emit({ ...data, ...res });
    });
  }

  formHandler() {
    let formValue = this.productForm.value;
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
      });
  }
}
