import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from "../../shared/footer/footer.component";
import { MostvotedComponent } from "../../shared/mostvoted/mostvoted.component";
import { MostrecentComponent } from "../../shared/mostrecent/mostrecent.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
    CommonModule,
    HttpClientModule,
    FooterComponent,
    MostvotedComponent,
    MostrecentComponent
]
})
export default class HomeComponent {



 }
