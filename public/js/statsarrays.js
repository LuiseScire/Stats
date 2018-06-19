//array para almacenar el total de descargas por mes
var meses = {
  '1': 0,
  '2': 0,
  '3': 0,
  '4': 0,
  '5': 0,
  '6': 0,
  '7': 0,
  '8': 0,
  '9': 0,
  '10': 0,
  '11': 0,
  '12': 0};

//array para mostrar el nombre del mes en las gráficas;
var mesesTxt = {
  '1': 'Ene',
  '2': 'Feb',
  '3': 'Mar',
  '4': 'Abril',
  '5': 'May',
  '6': 'Jun',
  '7': 'Jul',
  '8': 'Agost',
  '9': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dic'};

//array para almacenar el total de descargas por país
var codigoPais = {
  'AF' : 0,
  'AX' : 0,
  'AL' : 0,
  'DE' : 0,
  'AD' : 0,
  'AO' : 0,
  'AI' : 0,
  'AQ' : 0,
  'AG' : 0,
  'AN' : 0,
  'SA' : 0,
  'DZ' : 0,
  'AR' : 0,
  'AM' : 0,
  'AW' : 0,
  'AU' : 0,
  'AT' : 0,
  'AZ' : 0,

  'BS' : 0,
  'BH' : 0,
  'BD' : 0,
  'BB' : 0,
  'BY' : 0,
  'BE' : 0,
  'BZ' : 0,
  'BJ' : 0,
  'BM' : 0,
  'BT' : 0,
  'BO' : 0,
  'BA' : 0,
  'BW' : 0,
  'BV' : 0,
  'BR' : 0,
  'BN' : 0,
  'BG' : 0,
  'BF' : 0,
  'BI' : 0,

  'CV' : 0,
  'KY' : 0,
  'KH' : 0,
  'CM' : 0,
  'CA' : 0,
  'CF' : 0,
  'TD' : 0,
  'CZ' : 0,
  'CL' : 0,
  'CN' : 0,
  'CY' : 0,
  'CC' : 0,
  'CO' : 0,
  'KM' : 0,
  'CG' : 0,
  'CD' : 0,
  'CK' : 0,
  'KP' : 0,
  'KR' : 0,
  'CI' : 0,
  'CR' : 0,
  'HR' : 0,
  'CU' : 0,

  'DK' : 0,
  'DM' : 0,
  'DO' : 0,

  'EC' : 0,
  'EG' : 0,
  'SV' : 0,
  'AE' : 0,
  'ER' : 0,
  'SK' : 0,
  'SI' : 0,
  'ES' : 0,
  'EA' : 0,
  'US' : 0,
  'UM' : 0,
  'EE' : 0,
  'ET' : 0,

  'FO' : 0,
  'PH' : 0,
  'FI' : 0,
  'FJ' : 0,
  'FR' : 0,

  'GA' : 0,
  'GM' : 0,
  'GE' : 0,
  'GS' : 0,
  'GH' : 0,
  'GI' : 0,
  'GD' : 0,
  'GR' : 0,
  'GL' : 0,
  'GP' : 0,
  'GU' : 0,
  'GT' : 0,
  'GF' : 0,
  'GG' : 0,
  'GN' : 0,
  'GQ' : 0,
  'GW' : 0,
  'GY' : 0,

  'HT' : 0,
  'HM' : 0,
  'HN' : 0,
  'HK' : 0,
  'HU' : 0,

  'IN' : 0,
  'ID' : 0,
  'IR' : 0,
  'IQ' : 0,
  'IE' : 0,
  'IS' : 0,
  'IL' : 0,
  'IT' : 0,

  'JM' : 0,
  'JP' : 0,
  'JE' : 0,
  'JO' : 0,

  'KZ' : 0,
  'KE' : 0,
  'KG' : 0,
  'KI' : 0,
  'KW' : 0,

  'LA' : 0,
  'LS' : 0,
  'LV' : 0,
  'LB' : 0,
  'LR' : 0,
  'LY' : 0,
  'LI' : 0,
  'LT' : 0,
  'LU' : 0,

  'MO' : 0,
  'MK' : 0,
  'MG' : 0,
  'MY' : 0,
  'MW' : 0,
  'MV' : 0,
  'ML' : 0,
  'MT' : 0,
  'FK' : 0,
  'IM' : 0,
  'MP' : 0,
  'MA' : 0,
  'MH' : 0,
  'MQ' : 0,
  'MU' : 0,
  'MR' : 0,
  'YT' : 0,
  'MX' : 0,
  'FM' : 0,
  'MD' : 0,
  'MC' : 0,
  'MN' : 0,
  'ME' : 0,
  'MS' : 0,
  'MZ' : 0,
  'MM' : 0,

  'NA' : 0,
  'NR' : 0,
  'CX' : 0,
  'NP' : 0,
  'NI' : 0,
  'NE' : 0,
  'NG' : 0,
  'NU' : 0,
  'NF' : 0,
  'NO' : 0,
  'NC' : 0,
  'NZ' : 0,

  'OM' : 0,

  'NL' : 0,
  'PK' : 0,
  'PW' : 0,
  'PS' : 0,
  'PA' : 0,
  'PG' : 0,
  'PY' : 0,
  'PE' : 0,
  'PN' : 0,
  'PF' : 0,
  'PL' : 0,
  'PT' : 0,
  'PR' : 0,

  'QA' : 0,

  'GB' : 0,
  'RE' : 0,
  'RW' : 0,
  'RO' : 0,
  'RU' : 0,

  'EH' : 0,
  'SB' : 0,
  'WS' : 0,
  'AS' : 0,
  'KN' : 0,
  'SM' : 0,
  'PM' : 0,
  'VC' : 0,
  'SH' : 0,
  'LC' : 0,
  'ST' : 0,
  'SN' : 0,
  'RS' : 0,
  'SC' : 0,
  'SL' : 0,
  'SG' : 0,
  'SY' : 0,
  'SO' : 0,
  'LK' : 0,
  'SZ' : 0,
  'ZA' : 0,
  'SD' : 0,
  'SE' : 0,
  'CH' : 0,
  'SR' : 0,
  'SJ' : 0,

  'TH' : 0,
  'TW' : 0,
  'TZ' : 0,
  'TJ' : 0,
  'IO' : 0,
  'TF' : 0,
  'TL' : 0,
  'TG' : 0,
  'TK' : 0,
  'TO' : 0,
  'TT' : 0,
  'TN' : 0,
  'TC' : 0,
  'TM' : 0,
  'TR' : 0,
  'TV' : 0,

  'UA' : 0,
  'UG' : 0,
  'EU' : 0,
  'UY' : 0,
  'UZ' : 0,

  'VU' : 0,
  'VA' : 0,
  'VE' : 0,
  'VN' : 0,
  'VG' : 0,
  'VI' : 0,

  'WF' : 0,

  'YE' : 0,
  'DJ' : 0,

  'ZM' : 0,
  'ZW' : 0
}

//array para mostrar el nombre del país en las gráficas
var codigoPaisTxt = {
  'AF' : 'Afganistán',
  'AX' : 'Aland',
  'AL' : 'Albania',
  'DE' : 'Alemania',
  'AD' : 'Andorra',
  'AO' : 'Angola',
  'AI' : 'Anguila',
  'AQ' : 'Antártida',
  'AG' : 'Antigua y Barbuda',
  'AN' : 'Antillas Neerlandesas',
  'SA' : 'Arabia Saudita',
  'DZ' : 'Argelia',
  'AR' : 'Argentina',
  'AM' : 'Armenia',
  'AW' : 'Aruba',
  'AU' : 'Australia',
  'AT' : 'Austria',
  'AZ' : 'Azerbaiyán',

  'BS' : 'Bahamas',
  'BH' : 'Bahréin',
  'BD' : 'Bangladesh',
  'BB' : 'Barbados',
  'BY' : 'Bielorrusia',
  'BE' : 'Bélgica',
  'BZ' : 'Belice',
  'BJ' : 'Benín',
  'BM' : 'Bermudas',
  'BT' : 'Bután',
  'BO' : 'Bolivia',
  'BA' : 'Bosnia y Herzegovina',
  'BW' : 'Botsuana',
  'BV' : 'Isla Bouvet',
  'BR' : 'Brasil',
  'BN' : 'Brunéi',
  'BG' : 'Bulgaria',
  'BF' : 'Burkina Faso',
  'BI' : 'Burundi',

  'CV' : 'Cabo Verde',
  'KY' : 'Islas Caimán',
  'KH' : 'Camboya',
  'CM' : 'Camerún',
  'CA' : 'Canadá',
  'CF' : 'República Centroafricana',
  'TD' : 'Chad',
  'CZ' : 'República Checa',
  'CL' : 'Chile',
  'CN' : 'China',
  'CY' : 'Chipre',
  'CC' : 'Islas Cocos',
  'CO' : 'Colombia',
  'KM' : 'Comoras',
  'CG' : 'República del Congo',
  'CD' : 'República Democrática del Congo',
  'CK' : 'Islas Cook',
  'KP' : 'Corea del Norte',
  'KR' : 'Corea del Sur',
  'CI' : 'Costa de Marfil',
  'CR' : 'Costa Rica',
  'HR' : 'Croacia',
  'CU' : 'Cuba',

  'DK' : 'Dinamarca',
  'DM' : 'Dominica',
  'DO' : 'República Dominicana',

  'EC' : 'Ecuador',
  'EG' : 'Egipto',
  'SV' : 'El Salvador',
  'AE' : 'Emiratos Árabes Unidos',
  'ER' : 'Eritrea',
  'SK' : 'Eslovaquia',
  'SI' : 'Eslovenia',
  'ES' : 'España',
  'EA' : 'España (Ceuta y Melilla)',
  'US' : 'Estados Unidos',
  'UM' : 'Islas ultramarinas de Estados Unidos',
  'EE' : 'Estonia',
  'ET' : 'Etiopía',

  'FO' : 'Islas Feroe',
  'PH' : 'Filipinas',
  'FI' : 'Finlandia',
  'FJ' : 'Fiyi',
  'FR' : 'Francia',

  'GA' : 'Gabón',
  'GM' : 'Gambia',
  'GE' : 'Georgia',
  'GS' : 'Islas Georgias del Sur y Sandwich del Sur',
  'GH' : 'Ghana',
  'GI' : 'Gibraltar',
  'GD' : 'Granada',
  'GR' : 'Grecia',
  'GL' : 'Groenlandia',
  'GP' : 'Guadalupe',
  'GU' : 'Guam',
  'GT' : 'Guatemala',
  'GF' : 'Guayana Francesa',
  'GG' : 'Guernsey',
  'GN' : 'Guinea',
  'GQ' : 'Guinea Ecuatorial',
  'GW' : 'Guinea-Bissau',
  'GY' : 'Guyana',

  'HT' : 'Haití',
  'HM' : 'Islas Heard y McDonald',
  'HN' : 'Honduras',
  'HK' : 'Hong Kong',
  'HU' : 'Hungría',

  'IN' : 'India',
  'ID' : 'Indonesia',
  'IR' : 'Irán',
  'IQ' : 'Iraq',
  'IE' : 'Irlanda',
  'IS' : 'Islandia',
  'IL' : 'Israel',
  'IT' : 'Italia',

  'JM' : 'Jamaica',
  'JP' : 'Japón',
  'JE' : 'Jersey',
  'JO' : 'Jordania',

  'KZ' : 'Kazajistán',
  'KE' : 'Kenia',
  'KG' : 'Kirguistán',
  'KI' : 'Kiribati',
  'KW' : 'Kuwait',

  'LA' : 'Laos',
  'LS' : 'Lesoto',
  'LV' : 'Letonia',
  'LB' : 'Líbano',
  'LR' : 'Liberia',
  'LY' : 'Libia',
  'LI' : 'Liechtenstein',
  'LT' : 'Lituania',
  'LU' : 'Luxemburgo',

  'MO' : 'Macao',
  'MK' : 'ARY Macedonia',
  'MG' : 'Madagascar',
  'MY' : 'Malasia',
  'MW' : 'Malawi',
  'MV' : 'Maldivas',
  'ML' : 'Malí',
  'MT' : 'Malta',
  'FK' : 'Islas Malvinas',
  'IM' : 'Isla de Man',
  'MP' : 'Islas Marianas del Norte',
  'MA' : 'Marruecos',
  'MH' : 'Islas Marshall',
  'MQ' : 'Martinica',
  'MU' : 'Mauricio',
  'MR' : 'Mauritania',
  'YT' : 'Mayotte',
  'MX' : 'México',
  'FM' : 'Micronesia',
  'MD' : 'Moldavia',
  'MC' : 'Mónaco',
  'MN' : 'Mongolia',
  'ME' : 'Montenegro',
  'MS' : 'Montserrat',
  'MZ' : 'Mozambique',
  'MM' : 'Myanmar',

  'NA' : 'Namibia',
  'NR' : 'Nauru',
  'CX' : 'Isla de Navidad',
  'NP' : 'Nepal',
  'NI' : 'Nicaragua',
  'NE' : 'Níger',
  'NG' : 'Nigeria',
  'NU' : 'Niue',
  'NF' : 'Norfolk',
  'NO' : 'Noruega',
  'NC' : 'Nueva Caledonia',
  'NZ' : 'Nueva Zelanda',

  'OM' : 'Omán',

  'NL' : 'Países Bajos',
  'PK' : 'Pakistán',
  'PW' : 'Palaos',
  'PS' : 'Palestina (ANP)',
  'PA' : 'Panamá',
  'PG' : 'Papúa Nueva Guinea',
  'PY' : 'Paraguay',
  'PE' : 'Perú',
  'PN' : 'Islas Pitcairn',
  'PF' : 'Polinesia Francesa',
  'PL' : 'Polonia',
  'PT' : 'Portugal',
  'PR' : 'Puerto Rico',

  'QA' : 'Qatar',

  'GB' : 'Reino Unido',
  'RE' : 'Reunión',
  'RW' : 'Ruanda',
  'RO' : 'Rumania',
  'RU' : 'Rusia',

  'EH' : 'Sahara Occidental',
  'SB' : 'Islas Salomón',
  'WS' : 'Samoa',
  'AS' : 'Samoa Americana',
  'KN' : 'San Cristóbal y Nieves',
  'SM' : 'San Marino',
  'PM' : 'San Pedro y Miquelón',
  'VC' : 'San Vicente y las Granadinas',
  'SH' : 'Santa Helena',
  'LC' : 'Santa Lucía',
  'ST' : 'Santo Tomé y Príncipe',
  'SN' : 'Senegal',
  'RS' : 'Serbia',
  'SC' : 'Seychelles',
  'SL' : 'Sierra Leona',
  'SG' : 'Singapur',
  'SY' : 'Siria',
  'SO' : 'Somalia',
  'LK' : 'Sri Lanka',
  'SZ' : 'Suazilandia',
  'ZA' : 'Sudáfrica',
  'SD' : 'Sudán',
  'SE' : 'Suecia',
  'CH' : 'Suiza',
  'SR' : 'Surinam',
  'SJ' : 'Svalbard y Jan Mayen',

  'TH' : 'Tailandia',
  'TW' : 'Taiwán',
  'TZ' : 'Tanzania',
  'TJ' : 'Tayikistán',
  'IO' : 'Territorio Británico del Océano Índico',
  'TF' : 'Territorios Australes Franceses',
  'TL' : 'Timor Oriental',
  'TG' : 'Togo',
  'TK' : 'Tokelau',
  'TO' : 'Tonga',
  'TT' : 'Trinidad y Tobago',
  'TN' : 'Túnez',
  'TC' : 'Islas Turcas y Caicos',
  'TM' : 'Turkmenistán',
  'TR' : 'Turquía',
  'TV' : 'Tuvalu',

  'UA' : 'Ucrania',
  'UG' : 'Uganda',
  'EU' : 'Unión Europea',
  'UY' : 'Uruguay',
  'UZ' : 'Uzbekistán',

  'VU' : 'Vanuatu',
  'VA' : 'Ciudad del Vaticano',
  'VE' : 'Venezuela',
  'VN' : 'Vietnam',
  'VG' : 'Islas Vírgenes Británicas',
  'VI' : 'Islas Vírgenes Estadounidenses',

  'WF' : 'Wallis y Futuna',

  'YE' : 'Yemen',
  'DJ' : 'Yibuti',

  'ZM' : 'Zambia',
  'ZW' : 'Zimbabue'
}
