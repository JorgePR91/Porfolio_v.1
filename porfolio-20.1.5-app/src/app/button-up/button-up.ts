import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button-up',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './button-up.html',
  styleUrl: './button-up.scss'
})
export class ButtonUp {
  viewButtonUp = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.viewButtonUp = !this.esVisible();
  }

  esVisible(): boolean {
    const buttons = document.querySelector('#link_buttons') as HTMLElement;
    if (!buttons) return false;
    const posTopView = window.scrollY;
    const posButView = posTopView + window.innerHeight;
    const elemTop = buttons.offsetTop;
    const elemBottom = elemTop + buttons.offsetHeight;
    return (
      (elemBottom < posButView && elemBottom > posTopView) ||
      (elemTop > posTopView && elemTop < posButView)
    );
  }

    scrollToUp(): void {
      window.scrollTo({ 
      top: 0,
      behavior: 'smooth',
      });
    }
}
