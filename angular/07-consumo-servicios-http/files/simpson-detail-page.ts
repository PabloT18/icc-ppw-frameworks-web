import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SimpsonsService } from '../../services/simpsons.service';

@Component({
  selector: 'app-simpson-detail-page',
  templateUrl: './simpson-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
})
export class SimpsonDetailPageComponent {
  private route = inject(ActivatedRoute);
  private simpsonsService = inject(SimpsonsService);

  character = rxResource({
    params: () => ({ id: Number(this.route.snapshot.paramMap.get('id')) }),
    stream: ({ params }) => this.simpsonsService.getCharacterById(params.id),
  });
}
