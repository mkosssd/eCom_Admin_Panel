import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
    selector: 'app-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent {
    list = ['smartphones', 'skincare', 'fragrances', 'laptops', 'groceries'];
    
    toggler() {
        let sidebar = document.getElementById('sidebars').classList;
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
