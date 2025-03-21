import { Routes } from '@angular/router';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { EmpresasDetailComponent } from './components/empresas/empresas-detail/empresas-detail.component';
import { EmpresasFormComponent } from './components/empresas/empresas-form/empresas-form.component';
import { EmpresasListComponent } from './components/empresas/empresas-list/empresas-list.component';
import { AuthGuard } from './components/global/service/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ParcelamentosFormComponent } from './components/parcelamentos/parcelamentos-form/parcelamentos-form.component';
import { ParcelamentosListComponent } from './components/parcelamentos/parcelamentos-list/parcelamentos-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SociosFormComponent } from './components/socios/socios-form/socios-form.component';
import { SociosListComponent } from './components/socios/socios-list/socios-list.component';
import { ContatoComponent } from './components/contato/contato.component';
import { SobreComponent } from './components/sobre/sobre.component';


export const routes: Routes = [

    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'empresas', component: EmpresasListComponent, canActivate: [AuthGuard] },
    { path: 'parcelamentos', component: ParcelamentosListComponent, canActivate: [AuthGuard] },
    { path: 'usuarios', component: SociosListComponent, canActivate: [AuthGuard] },
    { path: 'empresas/:id', component: EmpresasDetailComponent, canActivate: [AuthGuard] },
    { path: 'nova-empresa', component: EmpresasFormComponent, canActivate: [AuthGuard] },
    { path: 'empresas/edit/:id', component: EmpresasFormComponent, canActivate: [AuthGuard] },
    { path: 'novo-parcelamento', component: ParcelamentosFormComponent, canActivate: [AuthGuard] },
    { path: 'parcelamentos/edit/:id', component: ParcelamentosFormComponent, canActivate: [AuthGuard] },
    { path: 'editar-parcelamento/:id', component: ParcelamentosFormComponent, canActivate: [AuthGuard] },
    { path: 'socios', component: SociosListComponent, canActivate: [AuthGuard] },
    { path: 'novo-socio', component: SociosFormComponent, canActivate: [AuthGuard] },
    { path: 'editar-socio/:id', component: SociosFormComponent, canActivate: [AuthGuard] },
    { path: 'contato', component: ContatoComponent},
    { path: 'sobre', component: SobreComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: CadastroComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
