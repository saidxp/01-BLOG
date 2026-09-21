import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
})

export class ConfirmModalComponent { 

  readonly isOpen = input.required<boolean>();
  readonly title = input<string>('Are you sure?');
  readonly message = input<string>('This action cannot be undone.');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
  
}