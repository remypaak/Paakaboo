import { Component } from '@angular/core';
import { HowToInstructionComponent } from "./how-to-instruction/how-to-instruction.component";
import { HeroComponent } from "./hero/hero.component";
import { RightSideComponent } from "./right-side/right-side.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HowToInstructionComponent, HeroComponent, RightSideComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{
    scrollToFooter() {
        const footerElement = document.getElementsByClassName('footer')[0];
        if (footerElement) {
          footerElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
}
