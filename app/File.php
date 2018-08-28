<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    public $timestamps = false;

    protected $table = 'files';

    protected $fillable = [
        'file_id',
        'file_front_name',
        'file_back_name',
        'file_path',
        'file_user_id',
        'file_journal_id',
        'file_version',
        'file_timestamp',
        'file_indices',
        'file_role_indices',
        'file_report_name',
        'file_report_index',
        'file_type',
        'file_status',
    ];
}
