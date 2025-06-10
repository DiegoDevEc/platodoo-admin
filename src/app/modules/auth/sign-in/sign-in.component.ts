import { SocialLogin } from './../../../core/services/interface/social-login';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        GoogleSigninButtonModule
    ]
})
export class AuthSignInComponent implements OnInit, OnDestroy {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    private _destroy$ = new Subject<void>();

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private authSocialService: SocialAuthService,
    ) { }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        console.log('✅ Google Client ID cargado:', environment.gClientId);

        this.authSocialService.authState
            .pipe(takeUntil(this._destroy$))
            .subscribe(user => {
                if (user && user.idToken) {
                    this.loginWithSocialUser(user);
                }
            });

        // Create the form
        this.signInForm = this._formBuilder.group({
            email: [
                '',
                [Validators.required, Validators.email],
            ],
            password: ['', Validators.required],
            rememberMe: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value).subscribe(
            () => {
                // Set the redirect url.
                // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                // to the correct page after a successful sign in. This way, that url can be set via
                // routing file and we don't have to touch here.
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get(
                        'redirectURL'
                    ) || '/signed-in-redirect';

                // Navigate to the redirect url
                this._router.navigateByUrl(redirectURL);
            },
            (response) => {
                // Re-enable the form
                this.signInForm.enable();

                // Reset the form
                this.signInNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Correo electrónico o contraseña incorrectos',
                };

                // Show the alert
                this.showAlert = true;
            }
        );
    }

    /* signInWithGoogle(): void {
         this.authSocialService.signIn(GoogleLoginProvider.PROVIDER_ID)
             .then((user) => {
                 console.log('Usuario de Google:', user);

                 const socialLogin: SocialLogin = {
                     token: user.idToken,
                     provider: user.provider,
                     firstName: user.firstName,
                     lastName: user.lastName,
                     email: user.email,
                     avatar: user.photoUrl
                 };

                 this._authService.signUpSocial(socialLogin).subscribe(
                     () => {
                         const redirectURL =
                             this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                         this._router.navigateByUrl(redirectURL);
                     },
                     (error) => {
                         console.error('Error en login social', error);
                     }
                 );
             })
             .catch((err) => {
                 console.error('Error iniciando sesión con Google:', err);
             });
     }*/


    loginWithSocialUser(user: any): void {

        const socialLogin: SocialLogin = {
            token: user.idToken,
            provider: user.provider,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.photoUrl
        };

        this._authService.signUpSocial(socialLogin).subscribe(
            () => {
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                this._router.navigateByUrl(redirectURL);
            },
            (error) => {
                console.error('Error en login social', error);
            }
        );


    }


}
