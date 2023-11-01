import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
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
