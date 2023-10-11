import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { LoaderComponent } from "./loader/loader.component";
import { MatTableModule } from "@angular/material/table";
import { MatSliderModule } from "@angular/material/slider";
import { AngularFireModule } from "@angular/fire/compat";
import {
	provideFirestore,
	getFirestore,
} from "@angular/fire/firestore";
import {
	initializeApp,
	provideFirebaseApp,
} from "@angular/fire/app";
import { environment } from "../enviroments/enviroments";
import { AdminPanelComponent } from "./admin-panel/admin-panel.component";
import {
	FormsModule,
	ReactiveFormsModule,
} from "@angular/forms";
import { LoginComponent } from "./auth/login/login.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { AddProductComponent } from "./admin-panel/add-product/add-product.component";
import { ProductListComponent } from "./admin-panel/product-list/product-list.component";
import { AddCategoryComponent } from "./admin-panel/add-category/add-category.component";
import { EditProductComponent } from "./admin-panel/edit-product/edit-product.component";
import { HeaderComponent } from "./header/header.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { UploadWidgetModule } from "@bytescale/upload-widget-angular";
import { CloudinaryModule } from "@cloudinary/ng";
@NgModule({
	declarations: [
		AppComponent,
		LoaderComponent,
		AdminPanelComponent,
		LoginComponent,
		SignUpComponent,
		AddProductComponent,
		ProductListComponent,
		AddCategoryComponent,

		EditProductComponent,
		HeaderComponent,
	],
	imports: [
		CloudinaryModule,
		BrowserModule,
		AngularFireStorageModule,
		AppRoutingModule,
		FormsModule,

		HttpClientModule,
		MatCardModule,
		MatGridListModule,
		MatTableModule,
		MatSliderModule,
		AngularFireModule,
		ReactiveFormsModule,
		ImageCropperModule,
		UploadWidgetModule,
		provideFirestore(() => getFirestore()),
		AngularFireModule.initializeApp(
			environment.firebaseConfig
		),
		provideFirebaseApp(() =>
			initializeApp(environment.firebaseConfig)
		),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
