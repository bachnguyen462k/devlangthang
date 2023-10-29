import { NgModule } from '@angular/core';


import { SharedModule } from '../shared';
import { RoadMapComponent } from './roadmap.component';
import { SerachRoutingModule } from './roadmap-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SerachRoutingModule
  ],
  declarations: [
    RoadMapComponent
  ],
  providers: [
  ]
})
export class RoadMapModule {}
