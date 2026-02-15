import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticiasComponent } from './components/noticias/noticias';
import { Home } from './pages/web/home/home';
import { Login } from './pages/auth/login/login';
import { Dashboard } from './pages/dashboard/dashboard-layout/dashboard';
import { Blog } from './pages/web/blog/blog';
import { NoticiaDetalle } from './pages/web/noticia-detalle/noticia-detalle';
import { escritorGuard } from './guards/escritorGuard';
import { authGuard } from './guards/authGuard';
import { staffGuard } from './guards/staffGuard';
import { adminGuard } from './guards/adminGuard';
import { atletaGuard } from './guards/atletaGuard';
import { Perfil } from './pages/dashboard/common/perfil/perfil';
import { Usuarios } from './pages/dashboard/admin/usuarios/usuarios';
import { MensajesContacto } from './pages/dashboard/admin/mensajes-contacto/mensajes-contacto';
import { MisClases } from './pages/dashboard/training/mis-clases/mis-clases';
import { GestionEntrenamientos } from './pages/dashboard/training/gestion-entrenamientos/gestion-entrenamientos';
import { NoticiasEscritor } from './pages/dashboard/content/noticias-escritor/noticias-escritor';

import { Mensajes } from './pages/dashboard/common/mensajes/mensajes';
import { mensajesGuard } from './guards/mensajesGuard';

const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'noticias',
    component: NoticiasComponent
  },

  {
    path: 'blog',
    component: Blog
  },
  {
    path: 'noticias/:id',
    component: NoticiaDetalle
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: 'perfil', component: Perfil },
      {
        path: 'usuarios',
        component: Usuarios,
        canActivate: [adminGuard]
      },
      {
        path: 'mensajes',
        component: Mensajes,
        canActivate: [mensajesGuard]
      },
      {
        path: 'mensajes-contacto',
        component: MensajesContacto,
        canActivate: [adminGuard]
      },
      {
        path: 'mis-clases',
        component: MisClases,
        canActivate: [atletaGuard]
      },
      {
        path: 'gestion-entrenamientos',
        component: GestionEntrenamientos,
        canActivate: [staffGuard]
      },
      {
        path: 'noticias-escritor',
        component: NoticiasEscritor,
        canActivate: [escritorGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
