import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styles: [`
    nav {
      background-color: #159;
      padding: 1rem;
      overflow: hidden;
    }
    a {
      color: white;
      text-decoration: none;
      margin-right: 1rem;
      font-weight: bold;
    }
    a.active {
      color: yellow;
      text-decoration: underline;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBar { }
