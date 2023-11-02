import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UploadWidgetModule } from '@bytescale/upload-widget-angular';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { ImageCropperModule } from 'ngx-image-cropper';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { environment } from '../enviroments/enviroments';
import { AddCategoryComponent } from './admin-panel/add-category/add-category.component';
import { AddProductComponent } from './admin-panel/add-product/add-product.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { EditProductComponent } from './admin-panel/edit-product/edit-product.component';
import { ProductListComponent } from './admin-panel/product-list/product-list.component';
import { AngularCropperComponent } from './angular-cropper/angular-cropper.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './loader/loader.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { SideBarComponent } from './side-bar/side-bar.component';
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
    AngularCropperComponent,
    SideBarComponent,
    PageTitleComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireStorageModule,
    AppRoutingModule,
    FormsModule,
    ImageCropperModule,
    AngularCropperjsModule,
    HttpClientModule,
    AngularFireModule,
    ReactiveFormsModule,
    ImageCropperModule,
    BreadcrumbModule,

    UploadWidgetModule,
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
