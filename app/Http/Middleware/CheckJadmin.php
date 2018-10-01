<?php

namespace Stats\Http\Middleware;

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
        // if(auth()->user()->journal_type == 'Admin'){
        //     return $next($request);
        // }
        $user_id = auth()->user()->id;
        $user_type = auth()->user()->journalType($user_id);
        if($user_type == 'Admin'){
            return $next($request);
        }

        return redirect('/');
    }
}
