import { Component, HostListener, Input, input, output } from '@angular/core';
import { Vote } from '../../_models/vote';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-votes-details',
  standalone: true,
  imports: [NgClass],
  templateUrl: './votes-details.component.html',
  styleUrl: './votes-details.component.scss',
})
export class VotesDetailsComponent {
  votes = input<Vote[]>([]);
  @Input() isOpen: boolean = false;
  closeModal = output()

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const modalContent = document.querySelector('.modal-content');
    const clickedModalContent = modalContent ? modalContent.contains(targetElement) : false;
    if (this.isOpen && !clickedModalContent){
        this.close()
    }
    
  }
  close(): void {
    this.isOpen = false;
    this.closeModal.emit();
  }
}
