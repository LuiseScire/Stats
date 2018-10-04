@extends('layouts.app')

@section('title', 'Login')

@section('content')

<!--<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Iniciar Sesión') }}</div>

                <div class="card-body">
                    <form method="POST" action="{{ route('login') }}" aria-label="{{ __('Login') }}">
                        @csrf

                        <div class="form-group row">
                            <label for="email" class="col-sm-4 col-form-label text-md-right">{{ __('Correo electrónico') }}</label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="{{ old('email') }}" required autofocus>

                                @if ($errors->has('email'))
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="password" class="col-md-4 col-form-label text-md-right">{{ __('Contraseña') }}</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" required>

                                @if ($errors->has('password'))
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-md-6 offset-md-4">
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}> {{ __('Remember Me') }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-8 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    {{ __('Entrar') }}
                                </button>

                                <a class="btn btn-link" href="{{ route('password.request') }}">
                                    {{ __('Forgot Your Password?') }}
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>-->

<div class="limiter">
    <div class="container-login100">
        <div class="wrap-login100">
            <div class="login100-form-title" style="background-image: url({{ asset('images/bg.jpg') }});">
					<span class="login100-form-title-1">
						eScire Stats
					</span>
            </div>

            <form method="POST" action="{{ route('login') }}" aria-label="{{ __('Login') }}" class="login100-form validate-form">
                @csrf
                <div class="wrap-input100 validate-input m-b-26" data-validate="Username is required">
                    <span class="label-input100">{{ __('Correo electrónico') }}</span>
                    <input id="email" type="email" class="input100{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="{{ old('email') }}" required autofocus>
                    @if ($errors->has('email'))
                        <!--<span class="invalid-feedback" role="alert">
                                        <strong></strong>
                                    </span>-->
                        <span class="focus-input100">{{ $errors->first('email') }}</span>
                    @endif

                </div>

                <div class="wrap-input100 validate-input m-b-18" data-validate = "Password is required">
                    <span class="label-input100">{{ __('Contraseña') }}</span>
                    <input id="password" type="password" class="input100{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" required>
                    @if ($errors->has('password'))
                       <!-- <span class="invalid-feedback" role="alert">
                                        <strong></strong>
                                    </span>-->
                        <span class="focus-input100">{{ $errors->first('password') }}</span>
                    @endif

                </div>

                <!--<div class="flex-sb-m w-full p-b-30">
                    <div class="contact100-form-checkbox">
                        <input class="input-checkbox100" id="ckb1" type="checkbox" name="remember-me">
                        <label class="label-checkbox100" for="ckb1">
                            Remember me
                        </label>
                    </div>

                    <div>
                        <a href="#" class="txt1">
                            Forgot Password?
                        </a>
                    </div>
                </div>-->

                <div class="container-login100-form-btn">
                    <button type="submit" class="login100-form-btn">
                        {{ __('Entrar') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

@endsection
