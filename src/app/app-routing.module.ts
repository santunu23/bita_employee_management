import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { TestcomponenetComponent } from './testcomponenet/testcomponenet.component';
import { EducatioQualificationComponent } from './educatio-qualification/educatio-qualification.component';
import { WorkexperienceComponent } from './workexperience/workexperience.component';
import { TrainingDataComponent } from './training-data/training-data.component';
import { RegistrationDetailsComponent } from './registration-details/registration-details.component';
import { LoginlandingpageComponent } from './loginlandingpage/loginlandingpage.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { GeneratecvComponent } from './generatecv/generatecv.component';

const routes: Routes = [
    { path: '', redirectTo: 'registration', pathMatch: 'full' },
    {path:'registration',component:RegistrationComponent},
    {path:'testrouting',component:TestcomponenetComponent},
    {path:'eduqualification',component:EducatioQualificationComponent},
    {path:'workexperience',component:WorkexperienceComponent},
    {path:'training_data',component:TrainingDataComponent},
    {path:'registraton_details',component:RegistrationDetailsComponent},
    {path:'welcome',component:LoginlandingpageComponent},
    {path:'login',component:LoginComponent},
    {path:'logout',component:LogoutComponent},
    {path:'generatecv',component:GeneratecvComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
