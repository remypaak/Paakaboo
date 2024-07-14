import { Component, output } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
    scrollToBottom = output();

    onReadMoreArrowClick(){
        this.scrollToBottom.emit();
    }
}
