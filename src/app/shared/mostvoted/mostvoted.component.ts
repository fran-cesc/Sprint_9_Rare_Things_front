import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Thing } from '../../interfaces/things.interface';
import { ThingsService } from '../../services/things.service';
import { RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-mostvoted',
  standalone: true,
  imports: [RouterLink, UpperCasePipe, TitleCasePipe, DatePipe],
  templateUrl: './mostvoted.component.html',
  styleUrl: './mostvoted.component.css'
})
export class MostvotedComponent {
  public mostVotedThings: Thing[] = [];
  public baseUrl: string = environment.BACKEND_BASE_URL;

  private thingsService = inject(ThingsService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor(){}

  ngOnInit(): void{
    this.thingsService.getMostVotedThings()
    .subscribe({
      next: (things) => {
        this.mostVotedThings = things;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log("Could not retrieve most recent things list. Error: ", error);
      }
    });
  }
}
