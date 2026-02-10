import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { CookieService } from 'ngx-cookie-service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule,DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { TestcomponenetComponent } from './testcomponenet/testcomponenet.component';
import { EducatioQualificationComponent } from './educatio-qualification/educatio-qualification.component';
import { WorkexperienceComponent } from './workexperience/workexperience.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SalaryBenefitComponent } from './salary-benefit/salary-benefit.component';
import { MatTableModule } from '@angular/material/table';
import { TrainingDataComponent } from './training-data/training-data.component';
import { RegistrationDetailsComponent } from './registration-details/registration-details.component';
import { LoginlandingpageComponent } from './loginlandingpage/loginlandingpage.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GeneratecvComponent } from './generatecv/generatecv.component';
import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR, REGION } from '@angular/fire/compat/functions';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    TestcomponenetComponent,
    EducatioQualificationComponent,
    WorkexperienceComponent,
    SalaryBenefitComponent,
    TrainingDataComponent,
    RegistrationDetailsComponent,
    LoginlandingpageComponent,
    LoginComponent,
    LogoutComponent,
    NavbarComponent,
    GeneratecvComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MatCheckboxModule,
    MatTableModule,
    MatNativeDateModule
    



  ],
  providers: [CookieService,
    { provide: REGION, useValue: 'us-central1' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
