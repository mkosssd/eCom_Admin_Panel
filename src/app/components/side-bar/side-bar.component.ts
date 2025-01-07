import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
    @Input() callbackFunction: () => void;
    toggler() {
        this.callbackFunction()
    }
    elements = [
        {
            menu_label: 'Product',
            icon_Class: 'bi bi-archive',
            sub_menu: [
                {
                    menu_label: 'Products List',
                    menu_link: 'product-list',
                    menu_icon: 'bi bi-list-stars'
                },
                {
                    menu_label: 'Add Product',
                    menu_link: 'add-product',
                    menu_icon: 'bi bi-plus'

                }
            ]
        },
        {
            menu_label: 'Category',
            icon_Class: 'bi bi-bookmarks',

            sub_menu: [
                {
                    menu_label: 'Add Category',
                    menu_link: 'add-category',
                    menu_icon: 'bi bi-plus'

                }

            ]
        }
    ]

    // toggler() {
    //   let sidebar = document.getElementById('sidebar').classList;
    //   let overlay = document.getElementById('overlay').classList;
    //   if (sidebar.contains('showSideBar')) {
    //     sidebar.remove('showSideBar');
    //     overlay.remove('overlay');
    //   } else {
    //     overlay.add('overlay');
    //     sidebar.add('showSideBar');
    //   }
    // }
}

