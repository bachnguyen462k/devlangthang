import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoadMapComponent } from './roadmap.component';
import { RoadMapAuthResolver } from './roadmap-auth-resolver.service';


const routes: Routes = [
  {
    path: 'roadmap',
    component: RoadMapComponent,
    resolve: {
      article: RoadMapAuthResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SerachRoutingModule {}
