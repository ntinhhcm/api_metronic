export class LoginCustom {

    static handleSignInFormSubmit() {
        $('#m_login_signin_submit').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    username: {
                        required: true,
                    },
                    password: {
                        required: true,
                    },
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }

    static displaySignInForm() {
        let login = $('#m_login');
        login.removeClass('m-login--forget-password');
        login.removeClass('m-login--signup');
        try {
            $('form').data('validator').resetForm();
        } catch (e) {
        }

        login.addClass('m-login--signin');
        (<any>login.find('.m-login__signin')).animateClass('flipInX animated');
    }

    static handleFormSwitch() {
        $('#m_login_forget_password_cancel').click((e) => {
            e.preventDefault();
            LoginCustom.displaySignInForm();
        });
    }

    static init() {
        LoginCustom.handleFormSwitch();
        LoginCustom.handleSignInFormSubmit();
    }
}