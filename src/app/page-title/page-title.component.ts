import { Component } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { filter, map, throttleTime, withLatestFrom } from 'rxjs';
import { DataService } from '../admin-panel/data.service';
import { BreadcrumbService } from 'xng-breadcrumb';
@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
})
export class PageTitleComponent {

  currentRouteURL: string;
  isId = null;
  pageTitle:string
  productName: string;
  parentURL: string;
  constructor(private router: Router, private dataService: DataService, private breadcrumbService: BreadcrumbService) {
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
      console.log(data);

      let breadcrumb = data[1]['breadcrumb'];
      this.pageTitle=breadcrumb
      this.currentRouteURL = router.url;

      let id = router.url.split('/').slice(3).join('/');
      if (id != '') {

        this.dataService
          .getProductById(id).subscribe((res) => {
            this.productName = res[0]['title']
            breadcrumbService.set('admin/edit-product/:id', this.productName);
          });
      }
    });
  }
}
