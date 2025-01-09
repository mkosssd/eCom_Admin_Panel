import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core"; import { DataService } from '../../../services/data.service';
import { CartItem } from 'src/app/services/cart-data.service';
import { Router } from '@angular/router';
import { ToastService } from "src/app/services/toast.service";
import { GeneralService } from "src/app/services/general.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { log } from "console";

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {

    page: number = 1;
    productsList: CartItem[];

    constructor(
        private data: DataService,
        private router: Router,
        private toastService: ToastService,
        private generalService: GeneralService,
        private modalService: NgbModal) { }

    ngOnInit(): void {
        this.data.getProducts().subscribe((res: CartItem[]) => {
            this.productsList = res;
            console.log(res[0]._id);
            
        });
    }

    deleteProduct(pid: string, i: number, modal: any) {
        this.modalService.open(modal).result.then((result)=>{

            this.productsList.splice(i, 1);
            this.generalService.showLoader(true)
            this.data.deleteProduct(pid).subscribe({
                next: res => {
                    this.generalService.showLoader(false)
                    this.toastService.show('Product Deleted Successfully!.', 'bg-success text-white fw-bolder')
                },
                error: error => {
                    this.generalService.showLoader(false)
                    this.toastService.show('Product cannot be deleted. Try again later!', 'bg-danger text-white fw-bolder')
                    
                }
            });
        }, (reason)=>{ })
    }
}
