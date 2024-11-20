import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Thing } from '../../interfaces/things.interface';
import { ThingsService } from '../../services/things.service';
import { RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-mostrecent',
  standalone: true,
  imports: [RouterLink, UpperCasePipe, TitleCasePipe, DatePipe],
  templateUrl: './mostrecent.component.html',
  styleUrl: './mostrecent.component.css'
})
export class MostrecentComponent {
  public mostRecentThings: Thing[] = [];
  public baseUrl: string = environment.BACKEND_BASE_URL;

  private thingsService = inject(ThingsService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor(){}

  ngOnInit(): void{
    this.thingsService.getMostRecentThings()
    .subscribe({
      next: (things) => {
        this.mostRecentThings = things;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log("Could not retrieve most recent things list. Error: ", error);
      }
    });
  }
}
