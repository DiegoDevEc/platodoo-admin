import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-full-screen-loading',
  standalone: true,
  templateUrl: './full-screen-loading.component.html',
  styleUrls: ['./full-screen-loading.component.scss']
})
export class FullScreenLoadingComponent {
  @Input() message: string = 'Cargando...';
}
