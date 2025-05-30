// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ReservasComponent } from './reservas/reservas.component';
import { MesasComponent } from './mesas/mesas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: 'mesas', component: MesasComponent } // Esto está bien
];