import { I18n } from './i18n';
import { environment } from '../environments/environment';
/**
 * Component
 */
import { AppComponent } from './app.component';
/**
 * Module
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from './shared/pipes/pipe.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'ng-sidebar';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { TimeagoModule, TimeagoFormatter, TimeagoCustomFormatter, TimeagoIntl } from 'ngx-timeago';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { ToastrModule } from 'ngx-toastr';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
/**
 * State
 */
import { UtenteState } from './features/navbar/store/states/operatore/utente.state';
import { AppState } from './shared/store/states/app/app.state';
import { SignalRState } from './core/signalr/store/signalR.state';
import { ToastrState } from './shared/store/states/toastr/toastr.state';
import { SediTreeviewState } from './shared/store/states/sedi-treeview/sedi-treeview.state';
/**
 * Service
 */
import { NavbarService } from './core/service/navbar-service/navbar.service';
import { NavbarServiceFake } from './core/service/navbar-service/navbar.service.fake';
/**
 * Route
 */
import { APP_ROUTING } from './app.routing';
/**
 * Interceptor
 */
import { JwtInterceptor, ErrorInterceptor, FakeBackendInterceptor } from './core/auth/_helpers';
import { SignalRInterceptor } from './core/signalr/signalR.interceptor';
/**
 * Module Components
 */
import { NavbarModule } from './features/navbar/navbar.module';
import { SharedModule } from './shared/shared.module';
import { AppLoadModule } from './core/app-load/app-load.module';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppLoadModule,
        ReactiveFormsModule,
        HttpClientModule,
        APP_ROUTING,
        NgbModule,
        FormsModule,
        FilterPipeModule,
        NgProgressModule,
        NgProgressHttpModule,
        SharedModule,
        NavbarModule,
        PipeModule.forRoot(),
        SidebarModule.forRoot(),
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
        }),
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-center',
            preventDuplicates: true,
        }),
        NgxsModule.forRoot(
            [AppState, UtenteState, SignalRState, ToastrState, SediTreeviewState],
            { developmentMode: !environment.production }
        ),
        // NgxsStoragePluginModule.forRoot({
        //     key: []
        // }),
        NgxsRouterPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot({
            name: 'SO115 - NGXS',
            disabled: environment.production,
        }),
        // NgxsLoggerPluginModule.forRoot({
        //     disabled: environment.production,
        // }),
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: SignalRInterceptor, multi: true },
        environment.fakeProvider ? { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true } : [],
        I18n,
        { provide: NavbarService, useClass: environment.fakeProvider ? NavbarServiceFake : NavbarService},
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
