import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticiasComponent } from './components/noticias/noticias';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Blog } from './pages/blog/blog';
import { NoticiaDetalle } from './pages/noticia-detalle/noticia-detalle';

const routes: Routes = [
  { path: '',
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
    path: 'dashboard',
    component: Dashboard
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
