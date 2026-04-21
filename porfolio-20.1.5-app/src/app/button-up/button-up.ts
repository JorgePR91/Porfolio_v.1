import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, HostListener, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button-up',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './button-up.html',
  styleUrl: './button-up.scss'
})
export class ButtonUp implements AfterViewInit, OnDestroy {
  viewButtonUp = false;
  private headerObserver?: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const header = document.querySelector('#app-header') as HTMLElement | null;
    if (!header) {
      this.updateButtonVisibility();
      return;
    }

    this.headerObserver = new IntersectionObserver(
      ([entry]) => {
        const passedTop = window.scrollY > 160;
        this.viewButtonUp = passedTop && !entry.isIntersecting;
      },
      { threshold: 0.2 }
    );

    this.headerObserver.observe(header);
    this.updateButtonVisibility();
  }

  ngOnDestroy(): void {
    this.headerObserver?.disconnect();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateButtonVisibility();
  }

  private updateButtonVisibility(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.viewButtonUp = false;
      return;
    }

    const header = document.querySelector('#app-header') as HTMLElement | null;
    if (!header) {
      this.viewButtonUp = window.scrollY > 160;
      return;
    }

    const rect = header.getBoundingClientRect();
    const headerVisible = rect.bottom > 80 && rect.top < window.innerHeight;
    this.viewButtonUp = window.scrollY > 160 && !headerVisible;
  }

  scrollToUp(): void {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      window.scrollTo({
      top: 0,
      behavior: 'smooth',
      });
  }
}
