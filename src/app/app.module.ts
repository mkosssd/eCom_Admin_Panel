import { HTTP_INTERCEPTORS, HttpClientModule, withInterceptors } from '@angular/common/http'

import { NgModule } from '@angular/core'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireStorageModule } from '@angular/fire/compat/storage'
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { UploadWidgetModule } from '@bytescale/upload-widget-angular'
import { AngularCropperjsModule } from 'angular-cropperjs'
import { ImageCropperModule } from 'ngx-image-cropper'
import { NgxPaginationModule } from 'ngx-pagination'
import { BreadcrumbModule } from 'xng-breadcrumb'
import { environment } from '../environments/environment'
import { AddProductComponent } from './modules/product/add-product/add-product.component'
import { AdminPanelComponent } from './modules/admin-panel.component'
import { EditProductComponent } from './modules/product/edit-product/edit-product.component'
import { ProductListComponent } from './modules/product/product-list/product-list.component'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './auth/login/login.component'
import { SignUpComponent } from './auth/sign-up/sign-up.component'
import { AngularCropperComponent } from './components/angular-cropper/angular-cropper.component'
import { ErrorPageComponent } from './components/error-page/error-page.component'
import { ToastsContainer } from './components/toast/toast-container'
import { NgbdToastGlobal } from './components/toast/toast.component'
import { LoaderComponent } from './components/loader/loader.component'
import { PageTitleComponent } from './components/page-title/page-title.component'
import { SideBarComponent } from './components/side-bar/side-bar.component'
import { HeaderComponent } from './components/header/header.component'
import { AddCategoryComponent } from './modules/category/add-category/add-category.component'
import { HeaderInterceptor } from './interceptor/interceptor'
@NgModule({
    declarations: [
        AppComponent,
        LoaderComponent,
        AdminPanelComponent,
        LoginComponent,
        SignUpComponent,
        AddProductComponent,
        ProductListComponent,
        EditProductComponent,
        AngularCropperComponent,
        SideBarComponent,
        PageTitleComponent,
        ErrorPageComponent,
        HeaderComponent,
        AddCategoryComponent
    ],
    imports: [
        BrowserModule,
        AngularFireStorageModule,
        AppRoutingModule,
        FormsModule,
        NgxPaginationModule,
        ImageCropperModule,
        AngularCropperjsModule,
        AngularFireModule,
        ReactiveFormsModule,
        ImageCropperModule,
        BreadcrumbModule,
        HttpClientModule,
        NgbdToastGlobal,
        ToastsContainer,

        UploadWidgetModule,
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    ],
    providers: [LoaderComponent, { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
