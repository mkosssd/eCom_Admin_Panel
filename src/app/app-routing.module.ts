import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthGuard } from './auth/auth.guard';
import { AddProductComponent } from './admin-panel/add-product/add-product.component';
import { AddCategoryComponent } from './admin-panel/add-category/add-category.component';
import { ProductListComponent } from './admin-panel/product-list/product-list.component';
import { EditProductComponent } from './admin-panel/edit-product/edit-product.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },

  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'product-list',
        pathMatch: 'full',
      },

      {
        path: 'add-product',
        component: AddProductComponent,
        data: { breadcrumb: { title: 'Add Product' } },
      },
      {
        path: 'add-category',
        component: AddCategoryComponent,
        data: { breadcrumb: { title: 'Add Category' } },
      },
      {
        path: 'product-list',
        component: ProductListComponent,
        data: { breadcrumb: { title: 'Product List' } },
      },
      {
        path: 'edit-product',
        children: [
          {
            path: ':id',
            component: EditProductComponent,
            data: { breadcrumb: { title: 'Edit Product' ,id:true} },
          },
        ],
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
