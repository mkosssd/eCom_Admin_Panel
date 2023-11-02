import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {

  elements = [
    {
      menu_label: 'Product',
      icon_Class: 'bi bi-archive',
      sub_menu: [
        {
          menu_label: 'Products List',
          menu_link: 'product-list',
        },
        {
          menu_label: 'Add Product',
          menu_link: 'add-product',
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
        }

      ]
    }
  ]

  toggler() {
    let sidebar = document.getElementById('sidebar').classList;
    let overlay = document.getElementById('overlay').classList;
    if (sidebar.contains('showSideBar')) {
      sidebar.remove('showSideBar');
      overlay.remove('overlay');
    } else {
      overlay.add('overlay');
      sidebar.add('showSideBar');
    }
  }
}

