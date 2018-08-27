<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Xmlfile extends Model
{
    public $timestamps = false;

    protected $table = 'xmlfiles';

    protected $fillable = [
        'xml_id',
        'xml_front_name',
        'xml_back_name',
        'xml_path',
        'xml_user_id',
        'xml_version',
        'xml_timestamp',
        'xml_indices',
        'xml_type_report',
        'xml_type_report_index',
        'xml_status',
    ];
}
