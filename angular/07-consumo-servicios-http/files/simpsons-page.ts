import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink, RouterModule } from '@angular/router';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { SimpsonsService } from '../../services/simpsons.service';
@Component({
  selector: 'app-simpsons-page',
  imports: [RouterLink, RouterModule],
  templateUrl: './simpsons-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SimpsonsPage {

  private simpsonsService = inject(SimpsonsService);

  paginationService = inject(PaginationService);  // público: el template lo usa

  readonly charactersPerPage = signal(10);

  simpsonsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage(),
      limit: this.charactersPerPage(),
    }),
    stream: ({ params }) =>
      this.simpsonsService.getCharactersOptions({
        page: params.page,
        limit: params.limit,
      }),
  });



}
