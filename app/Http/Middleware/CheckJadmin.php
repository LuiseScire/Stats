<?php

namespace App\Http\Middleware;

use Closure;

class CheckJadmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(auth()->user()->journal_type == 'Admin'){
            return $next($request);
        }

        return redirect('/');
    }
}
