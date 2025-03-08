import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit {
searchQuery: any;
onSearch($event: Event) {
throw new Error('Method not implemented.');
}
  isSmallScreen = false;
  generatedConstraint: string = '';
  pageTitle: string = 'Application Title';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private titleService: Title
  ) {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Handset])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
  }

  ngOnInit(): void {
    // Listen to route changes to dynamically update the title
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          const route = this.router.routerState.root;
          return this.getRouteTitle(route);
        })
      )
      .subscribe(title => {
        this.pageTitle = title;
        this.titleService.setTitle(title); // Update the browser tab title
      });
  }

  private getRouteTitle(route: ActivatedRoute): string {
    let child = route;
    while (child.firstChild) {
      child = child.firstChild;
    }
    return child.snapshot.data['title'] || '';
  }
}
