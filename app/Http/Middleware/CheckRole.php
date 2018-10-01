<?php

namespace Stats\Http\Middleware;

use Closure;
use Stats\User;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    /*public function handle($request, Closure $next)
    {
        return $next($request);
    }*/

    public function handle($request, Closure $next)
    {
        if (auth()->user()->user_type == 'Admin') {
            return $next($request);
        }

        return redirect('/');
    }

}
