import {
	Component,
	OnInit,
} from "@angular/core";
import { AdminServiceService } from "../admin-service.service";
import {
	ImageCroppedEvent,
	LoadedImage,
} from "ngx-image-cropper";
import { DomSanitizer } from "@angular/platform-browser";
import {
	FormGroup,
	Validators,
	FormControl,
} from "@angular/forms";
import { DataService } from "../data.service";
// import "firebase/storage";
import { HttpClient } from "@angular/common/http";
import { initializeApp } from "firebase/app";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytes,
} from "firebase/storage";
import { environment } from "../../../enviroments/enviroments";

@Component({
	selector: "app-add-product",
	templateUrl: "./add-product.component.html",
	styleUrls: ["./add-product.component.scss"],
})
export class AddProductComponent
	implements OnInit
{
	firebaseApp = initializeApp(
		environment.firebaseConfig
	);

	// Get a reference to the storage service, which is used to create references in your storage bucket
	storage = getStorage(this.firebaseApp);
	constructor(
		private sanitizer: DomSanitizer,
		private data: DataService,
		private prodService: AdminServiceService,
		private http: HttpClient // private afStorage:AngularFireStorage
	) {}
	imageChangedEvent: any = "";
	croppedImage: any = "";
	productForm: FormGroup;
	numRegex = /\d+$/;
	file: any;
	base64;
	fileChangeEvent(event: any): void {
		this.imageChangedEvent = event;
		this.croppedImage = event.target.files[0];
	}
	imageCropped(event: ImageCroppedEvent) {
		if (event.objectUrl) {
			this.croppedImage = event.objectUrl;
			console.log(event);

			fetch(event.objectUrl)
				.then((res) => res.blob())
				.then((blob) => {
					const file = new File([blob], "png", {
						type: blob.type,
					});
					// console.log(file);

					const fr = new FileReader();
					fr.readAsDataURL(file);
					fr.addEventListener("load", () => {
						const res = fr.result;
						console.log(res);
						this.base64 = file;
					});
				});
		}
	}
	imageLoaded(image: LoadedImage) {
		// show cropper
	}
	cropperReady() {
		// cropper ready
	}
	loadImageFailed() {
		// show message
	}
	ngOnInit(): void {
		this.productForm = new FormGroup({
			title: new FormControl(
				"",
				Validators.required
			),
			category: new FormControl(
				"",
				Validators.required
			),
			image:new FormControl(null,Validators.required),
			price: new FormControl(null, [
				Validators.required,
				Validators.pattern(this.numRegex),
			]),
			stock: new FormControl(null, [
				Validators.required,
				Validators.pattern(this.numRegex),
			]),
		});
		this.data
			.getCategories()
			.subscribe((res: any) => {
				this.list = Object.values(res);
			});
	}
	list = [];

	formHandler() {
		let formValue = this.productForm.value;
		let img: string[] = [];

		const refStorage = ref(
			this.storage,
			`images/${formValue.title}`
		);

		uploadBytes(refStorage, this.base64)
			.then((snapshot) => {
				console.log("Uploaded a blob or file!");
				return getDownloadURL(snapshot.ref);
			})
			.then((downloadURL) => {
				console.log(downloadURL);
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
