<?php

namespace Stats\Http\Middleware;

use Closure;

class CheckJournal
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
      if (auth()->user()->userType() == 'Journal') {
          return $next($request);
      }

      return redirect('/admin/panel');
    }
}
