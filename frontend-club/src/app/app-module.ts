import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NoticiasComponent } from './components/noticias/noticias';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { Home } from './pages/web/home/home';
import { Login } from './pages/auth/login/login';
import { Dashboard } from './pages/dashboard/dashboard-layout/dashboard';
import { InfoSection } from './components/info-section/info-section';
import { Horarios } from './components/horarios/horarios';
import { Contacto } from './components/contacto/contacto';
import { Footer } from './components/footer/footer';
import { ParallaxBanner } from './components/parallax-banner/parallax-banner';
import { Blog } from './pages/web/blog/blog';
import { NoticiaDetalle } from './pages/web/noticia-detalle/noticia-detalle';
import { GaleriaInstalaciones } from './components/galeria-instalaciones/galeria-instalaciones';
import { GaleriaEquipo } from './components/galeria-equipo/galeria-equipo';
import { Perfil } from './pages/dashboard/common/perfil/perfil';
import { Usuarios } from './pages/dashboard/admin/usuarios/usuarios';
import { MensajesContacto } from './pages/dashboard/admin/mensajes-contacto/mensajes-contacto';
import { MisClases } from './pages/dashboard/training/mis-clases/mis-clases';
import { GestionEntrenamientos } from './pages/dashboard/training/gestion-entrenamientos/gestion-entrenamientos';
import { NoticiasEscritor } from './pages/dashboard/content/noticias-escritor/noticias-escritor';
import { Mensajes } from './pages/dashboard/common/mensajes/mensajes';



@NgModule({
  declarations: [
    App,
    NoticiasComponent,
    NavbarComponent,
    HeroComponent,
    Home,
    Dashboard,
    InfoSection,
    Horarios,
    Contacto,
    Footer,
    Login,
    ParallaxBanner,
    Blog,
    NoticiaDetalle,
    GaleriaInstalaciones,
    GaleriaEquipo,
    Perfil,
    Usuarios,
    MensajesContacto,
    MisClases,
    GestionEntrenamientos,
    NoticiasEscritor,
    Mensajes


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
