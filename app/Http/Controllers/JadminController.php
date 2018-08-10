<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class JadminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function users() {
        return view('jadmin.users');
    }
}
