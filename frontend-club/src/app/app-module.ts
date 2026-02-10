import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NoticiasComponent } from './components/noticias/noticias';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { InfoSection } from './components/info-section/info-section';
import { Horarios } from './components/horarios/horarios';
import { Contacto } from './components/contacto/contacto';
import { Footer } from './components/footer/footer';
import { ParallaxBanner } from './components/parallax-banner/parallax-banner';
import { Blog } from './pages/blog/blog';
import { NoticiaDetalle } from './pages/noticia-detalle/noticia-detalle';
import { GaleriaInstalaciones } from './components/galeria-instalaciones/galeria-instalaciones';
import { GaleriaEquipo } from './components/galeria-equipo/galeria-equipo';


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
    GaleriaEquipo
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
