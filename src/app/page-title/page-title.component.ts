import { Component } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { filter, map, throttleTime, withLatestFrom } from 'rxjs';
import { DataService } from '../admin-panel/data.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
})
export class PageTitleComponent {
  currentRoute: string;
  currentRouteURL: string;
  isId = null;
  productName: string;
  parentURL:string
  constructor(private router: Router, private dataService: DataService) {
    const routerData$ = this.router.events.pipe(
      filter((e) => e instanceof ActivationEnd),
      throttleTime(0),
      map((e: ActivationEnd) => e.snapshot.data)
    );
    const urlAfterRedirects$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((navEnd: NavigationEnd) => navEnd.urlAfterRedirects)
    );
    urlAfterRedirects$.pipe(withLatestFrom(routerData$)).subscribe((data) => {
      this.isId = false;
      let breadcrumb = data[1]['breadcrumb'];
      this.currentRoute = breadcrumb['title'];
      this.currentRouteURL = router.url;
      if (breadcrumb['id']) {
        this.isId = breadcrumb['id'];
        console.log(this.parentURL);
        
        let id =  router.url.split('/').slice(3).join("/")
        this.dataService
        .getProductById(id)
        .subscribe((res) => (this.productName = res[0]['title']));
      }
    });
  }
}
