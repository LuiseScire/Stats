<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Csvfile extends Model
{
  public $timestamps = false;

  protected $table = "csvfiles";

  protected $fillable = [
    'csv_name',
    'csv_path',
    'csv_user_id',
    'csv_status'
  ];
}
