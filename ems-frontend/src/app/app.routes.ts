import { Routes } from '@angular/router';
import { LoginComponent } from './login/app.login'
import { EmployeeListComponent } from './employee/employee-list.component';
import { EmployeeFormComponent } from './employee/employee-form.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { 
        path: 'employees', 
        component: EmployeeListComponent,
        canActivate: [authGuard]
    },
    { 
        path: 'employees/form', 
        component: EmployeeFormComponent,
        canActivate: [authGuard]
    },
    { path: '', redirectTo: 'employees', pathMatch: 'full' }, 
];
