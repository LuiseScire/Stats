<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    public $timestamps = false;

    protected $table = 'folders';

    protected $fillable = [
        'folder_id',
        'folder_parent_id',
        'folder_name',
        'folder_total_files',
        'folder_journal_id',
        'folder_status'
    ];
}
