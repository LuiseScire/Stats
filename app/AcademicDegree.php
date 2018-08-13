<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AcademicDegree extends Model{
    public $timestamps = false;

    protected $table = 'academic_degree';

    protected $fillable = [
        'degree_id',
        'degree_name',
        'degree_status'
    ];

}
