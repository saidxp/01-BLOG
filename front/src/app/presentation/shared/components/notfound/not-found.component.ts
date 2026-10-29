import { Component, input } from "@angular/core";

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  imports: [RouterLink],
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  // Defaults fit the wildcard route; pages can pass friendlier wording inline.
  readonly heading = input('Page not found');
  readonly description = input('The page you\'re looking for doesn\'t exist.');
}