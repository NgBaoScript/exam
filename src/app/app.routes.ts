import { Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { AddNewComponent } from './components/add-new/add-new.component';

export const routes: Routes = [
    { path: '', component: ListComponent },
    { path: 'add-new', component: AddNewComponent },
];
