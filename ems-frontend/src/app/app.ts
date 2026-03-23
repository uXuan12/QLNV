import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Phải có RouterOutlet để file HTML hiểu thẻ <router-outlet>
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'Quản lý Nhân sự';
}