<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Csvfile extends Model
{
  public $timestamps = false;

  protected $table = "csvfiles";

  protected $fillable = [
    'csv_id',
    'csv_front_name',
    'csv_back_name',
    'csv_path',
    'csv_user_id',
    'csv_status',
    'csv_version',
    'csv_timestamp',
    'csv_indices',
    'csv_type_report',
    'csv_type_report_index'
  ];
}
