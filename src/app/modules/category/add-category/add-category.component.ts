import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast.service';
import { Category } from 'src/app/interface/category';
import { GeneralService } from 'src/app/services/general.service';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-add-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
    constructor(
        private data: DataService,
        private router: Router,
        private modalService: NgbModal,
        private generalService: GeneralService,
        private toastService: ToastService,
    ) { }

    categories: Category[];
    categoryForm: FormGroup;
    isLoading = false

    ngOnInit(): void {
        this.isLoading = true
        this.categoryForm = new FormGroup({
            category: new FormControl('', Validators.required),
        });

        this.data.getCategories().subscribe((res: Category[]) => {
            this.categories = res;
            this.isLoading = false
        });

    }
    formHandler() {
        this.generalService.showLoader(true)

        let categoryName: string = this.categoryForm.value['category'];
        let category: Category = {
            category: categoryName.toLocaleLowerCase(),
        }
        this.data.setCategories(category).subscribe({
            next: (res: Category) => {
                this.categories.push(res)
                this.generalService.showLoader(false)
                this.toastService.show('Category Added Successfully!.', 'bg-success text-white fw-bolder')
            },
            error: err => {
                this.generalService.showLoader(false)
                this.toastService.show('Category cannot be added. Try again later!', 'bg-danger text-white fw-bolder')

            }
        })
    }

    deleteCategory(id: string, index: number, modal: any) {
        this.modalService.open(modal).result.then((result) => {

            this.categories.splice(index, 1);
            this.generalService.showLoader(true)
            this.data.deleteCategory(id).subscribe({
                next: res => {
                    this.generalService.showLoader(false)
                    this.toastService.show('Category Deleted Successfully!.', 'bg-success text-white fw-bolder')
                },
                error: error => {
                    this.generalService.showLoader(false)
                    this.toastService.show('Category cannot be deleted. Try again later!', 'bg-danger text-white fw-bolder')
                }
            });
        }, (reason) => { })
    }

}
