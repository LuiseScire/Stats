// https://country-code.cl/es/
//objetos
var monthsObj = [
  {name: 'Ene',   downloads: 0},
  {name: 'Feb',   downloads: 0},
  {name: 'Mar',   downloads: 0},
  {name: 'Abr', downloads: 0},
  {name: 'May',   downloads: 0},
  {name: 'Jun',   downloads: 0},
  {name: 'Jul',   downloads: 0},
  {name: 'Ago', downloads: 0},
  {name: 'Sep',   downloads: 0},
  {name: 'Oct',   downloads: 0},
  {name: 'Nov',   downloads: 0},
  {name: 'Dic',   downloads: 0}
];

var countriesObj = [
  {code : 'UNK', downloads: 0,continent: 'Desconocido',  name: 'Desconocido'},

  {code : 'AF', downloads: 0, continent: 'Asia',      name: 'Afganistán'},
  {code : 'AX', downloads: 0, continent: 'Europa',    name: 'Aland'},
  {code : 'AL', downloads: 0, continent: 'Europa',    name: 'Albania'},
  {code : 'DE', downloads: 0, continent: 'Europa',    name: 'Alemania'},
  {code : 'AD', downloads: 0, continent: 'Europa',    name: 'Andorra'},
  {code : 'AO', downloads: 0, continent: 'África',    name: 'Angola'},
  {code : 'AI', downloads: 0, continent: 'América',   name: 'Anguila'},
  {code : 'AQ', downloads: 0, continent: 'Antártida', name: 'Antártida'},
  {code : 'AG', downloads: 0, continent: 'América',   name: 'Antigua y Barbuda'},
  {code : 'AN', downloads: 0, continent: 'Europa',    name: 'Antillas Neerlandesas'},
  {code : 'SA', downloads: 0, continent: 'Asia',      name: 'Arabia Saudita'},
  {code : 'DZ', downloads: 0, continent: 'África',    name: 'Argelia'},
  {code : 'AR', downloads: 0, continent: 'América',   name: 'Argentina'},
  {code : 'AM', downloads: 0, continent: 'Asia',      name: 'Armenia'},
  {code : 'AW', downloads: 0, continent: 'América',   name: 'Aruba'},
  {code : 'AU', downloads: 0, continent: 'Oceanía',   name: 'Australia'},
  {code : 'AT', downloads: 0, continent: 'Europa',    name: 'Austria'},
  {code : 'AZ', downloads: 0, continent: 'Asia',      name: 'Azerbaiyán'},

  {code: 'BS', downloads: 0, continent: 'América',    name: 'Bahamas'},
  {code: 'BH', downloads: 0, continent: 'Asia',       name: 'Bahréin'},
  {code: 'BD', downloads: 0, continent: 'Asia',       name: 'Bangladesh'},
  {code: 'BB', downloads: 0, continent: 'América',    name: 'Barbados'},
  {code: 'BY', downloads: 0, continent: 'Europa',     name: 'Bielorrusia'},
  {code: 'BE', downloads: 0, continent: 'Europa',     name: 'Bélgica'},
  {code: 'BZ', downloads: 0, continent: 'América',    name: 'Belice'},
  {code: 'BJ', downloads: 0, continent: 'África',     name: 'Benín'},
  {code: 'BM', downloads: 0, continent: 'América',    name: 'Bermudas'},
  {code: 'BT', downloads: 0, continent: 'Asia',       name: 'Bután'},
  {code: 'BO', downloads: 0, continent: 'América',    name: 'Bolivia'},
  {code: 'BA', downloads: 0, continent: 'Europa',     name: 'Bosnia y Herzegovina'},
  {code: 'BW', downloads: 0, continent: 'África',     name: 'Botsuana'},
  {code: 'BV', downloads: 0, continent: 'Antártida',  name: 'Isla Bouvet'},
  {code: 'BR', downloads: 0, continent: 'América',    name: 'Brasil'},
  {code: 'BN', downloads: 0, continent: 'Asia',       name: 'Brunéi'},
  {code: 'BG', downloads: 0, continent: 'Europa',     name: 'Bulgaria'},
  {code: 'BF', downloads: 0, continent: 'África',     name: 'Burkina Faso'},
  {code: 'BI', downloads: 0, continent: 'África',     name: 'Burundi'},

  {code: 'CV', downloads: 0, continent: 'África',     name: 'Cabo Verde'},
  {code: 'KY', downloads: 0, continent: 'América',    name: 'Islas Caimán'},
  {code: 'KH', downloads: 0, continent: 'Asia',       name: 'Camboya'},
  {code: 'CM', downloads: 0, continent: 'África',     name: 'Camerún'},
  {code: 'CA', downloads: 0, continent: 'América',    name: 'Canadá'},
  {code: 'CF', downloads: 0, continent: 'África',     name: 'República Centroafricana'},
  {code: 'TD', downloads: 0, continent: 'África',     name: 'Chad'},
  {code: 'CZ', downloads: 0, continent: 'Europa',     name: 'República Checa'},
  {code: 'CL', downloads: 0, continent: 'América',    name: 'Chile'},
  {code: 'CN', downloads: 0, continent: 'Asia',       name: 'China'},
  {code: 'CY', downloads: 0, continent: 'Asia',       name: 'Chipre'},
  {code: 'CC', downloads: 0, continent: 'Asia',       name: 'Islas Cocos'},
  {code: 'CO', downloads: 0, continent: 'América',    name: 'Colombia'},
  {code: 'KM', downloads: 0, continent: 'África',     name: 'Comoras'},
  {code: 'CG', downloads: 0, continent: 'África',     name: 'República del Congo'},
  {code: 'CD', downloads: 0, continent: 'África',     name: 'República Democrática del Congo'},
  {code: 'CK', downloads: 0, continent: 'Oceanía',    name: 'Islas Cook'},
  {code: 'KP', downloads: 0, continent: 'Asia',       name: 'Corea del Norte'},
  {code: 'KR', downloads: 0, continent: 'Asia',       name: 'Corea del Sur'},
  {code: 'CI', downloads: 0, continent: 'África',     name: 'Costa de Marfil'},
  {code: 'CR', downloads: 0, continent: 'América',    name: 'Costa Rica'},
  {code: 'HR', downloads: 0, continent: 'Europa',     name: 'Croacia'},
  {code: 'CU', downloads: 0, continent: 'América',    name: 'Cuba'},

  {code: 'DK', downloads: 0, continent: 'Europa',     name: 'Dinamarca'},
  {code: 'DM', downloads: 0, continent: 'América',    name: 'Dominica'},
  {code: 'DO', downloads: 0, continent: 'América',    name: 'República Dominicana'},

  {code: 'EC', downloads: 0, continent: 'América',    name: 'Ecuador'},
  {code: 'EG', downloads: 0, continent: 'África',     name: 'Egipto'},
  {code: 'SV', downloads: 0, continent: 'América',    name: 'El Salvador'},
  {code: 'AE', downloads: 0, continent: 'Asia',       name: 'Emiratos Árabes Unidos'},
  {code: 'ER', downloads: 0, continent: 'África',     name: 'Eritrea'},
  {code: 'SK', downloads: 0, continent: 'Europa',     name: 'Eslovaquia'},
  {code: 'SI', downloads: 0, continent: 'Europa',     name: 'Eslovenia'},
  {code: 'ES', downloads: 0, continent: 'Europa',     name: 'España'},
  {code: 'EA', downloads: 0, continent: 'Europa',     name: 'España (Ceuta y Melilla)'},
  {code: 'US', downloads: 0, continent: 'América',    name: 'Estados Unidos'},
  {code: 'UM', downloads: 0, continent: 'Oceanía',    name: 'Islas ultramarinas de Estados Unidos'},
  {code: 'EE', downloads: 0, continent: 'Europa',     name: 'Estonia'},
  {code: 'ET', downloads: 0, continent: 'África',     name: 'Etiopía'},

  {code: 'FO', downloads: 0, continent: 'Europa',     name: 'Islas Feroe'},
  {code: 'PH', downloads: 0, continent: 'Asia',       name: 'Filipinas'},
  {code: 'FI', downloads: 0, continent: 'Europa',     name: 'Finlandia'},
  {code: 'FJ', downloads: 0, continent: 'Oceanía',    name: 'Fiyi'},
  {code: 'FR', downloads: 0, continent: 'Europa',     name: 'Francia'},

  {code: 'GA', downloads: 0, continent: 'África',     name: 'Gabón'},
  {code: 'GM', downloads: 0, continent: 'África',     name: 'Gambia'},
  {code: 'GE', downloads: 0, continent: 'Asia',       name: 'Georgia'},
  {code: 'GS', downloads: 0, continent: 'Antártida',  name: 'Islas Georgias del Sur y Sandwich del Sur'},
  {code: 'GH', downloads: 0, continent: 'África',     name: 'Ghana'},
  {code: 'GI', downloads: 0, continent: 'Europa',     name: 'Gibraltar'},
  {code: 'GD', downloads: 0, continent: 'América',    name: 'Granada'},
  {code: 'GR', downloads: 0, continent: 'Europa',     name: 'Grecia'},
  {code: 'GL', downloads: 0, continent: 'América',    name: 'Groenlandia'},
  {code: 'GP', downloads: 0, continent: 'América',    name: 'Guadalupe'},
  {code: 'GU', downloads: 0, continent: 'Oceanía',    name: 'Guam'},
  {code: 'GT', downloads: 0, continent: 'América',    name: 'Guatemala'},
  {code: 'GF', downloads: 0, continent: 'América',    name: 'Guayana Francesa'},
  {code: 'GG', downloads: 0, continent: 'Europa',     name: 'Guernsey'},
  {code: 'GN', downloads: 0, continent: 'África',     name: 'Guinea'},
  {code: 'GQ', downloads: 0, continent: 'África',     name: 'Guinea Ecuatorial'},
  {code: 'GW', downloads: 0, continent: 'África',     name: 'Guinea-Bissau'},
  {code: 'GY', downloads: 0, continent: 'América',    name: 'Guyana'},

  {code: 'HT', downloads: 0, continent: 'América',    name: 'Haití'},
  {code: 'HM', downloads: 0, continent: 'Antártida',  name: 'Islas Heard y McDonald'},
  {code: 'HN', downloads: 0, continent: 'América',    name: 'Honduras'},
  {code: 'HK', downloads: 0, continent: 'Asia',       name: 'Hong Kong'},
  {code: 'HU', downloads: 0, continent: 'Europa',     name: 'Hungría'},

  {code: 'IN', downloads: 0, continent: 'Asia',       name: 'India'},
  {code: 'ID', downloads: 0, continent: 'Asia',       name: 'Indonesia'},
  {code: 'IR', downloads: 0, continent: 'Asia',       name: 'Irán'},
  {code: 'IQ', downloads: 0, continent: 'Asia',       name: 'IraK'},
  {code: 'IE', downloads: 0, continent: 'Europa',     name: 'Irlanda'},
  {code: 'IS', downloads: 0, continent: 'Europa',     name: 'Islandia'},
  {code: 'IL', downloads: 0, continent: 'Asia',       name: 'Israel'},
  {code: 'IT', downloads: 0, continent: 'Europa',     name: 'Italia'},

  {code: 'JM', downloads: 0, continent: 'América',    name: 'Jamaica'},
  {code: 'JP', downloads: 0, continent: 'Asia',       name: 'Japón'},
  {code: 'JE', downloads: 0, continent: 'Europa',     name: 'Jersey'},
  {code: 'JO', downloads: 0, continent: 'Asia',       name: 'Jordania'},

  {code: 'KZ', downloads: 0, continent: 'Asia',       name: 'Kazajistán'},
  {code: 'KE', downloads: 0, continent: 'África',     name: 'Kenia'},
  {code: 'KG', downloads: 0, continent: 'Asia',       name: 'Kirguistán'},
  {code: 'KI', downloads: 0, continent: 'Oceanía',    name: 'Kiribati'},
  {code: 'KW', downloads: 0, continent: 'Asia',       name: 'Kuwait'},

  {code: 'LA', downloads: 0, continent: 'Asia',       name: 'Laos'},
  {code: 'LS', downloads: 0, continent: 'África',     name: 'Lesoto'},
  {code: 'LV', downloads: 0, continent: 'Europa',     name: 'Letonia'},
  {code: 'LB', downloads: 0, continent: 'Asia',       name: 'Líbano'},
  {code: 'LR', downloads: 0, continent: 'África',     name: 'Liberia'},
  {code: 'LY', downloads: 0, continent: 'África',     name: 'Libia'},
  {code: 'LI', downloads: 0, continent: 'Europa',     name: 'Liechtenstein'},
  {code: 'LT', downloads: 0, continent: 'Europa',     name: 'Lituania'},
  {code: 'LU', downloads: 0, continent: 'Europa',     name: 'Luxemburgo'},

  {code: 'MO', downloads: 0, continent: 'Asia',       name: 'Macao'},
  {code: 'MK', downloads: 0, continent: 'Europa',     name: 'ARY Macedonia'},
  {code: 'MG', downloads: 0, continent: 'África',     name: 'Madagascar'},
  {code: 'MY', downloads: 0, continent: 'Asia',       name: 'Malasia'},
  {code: 'MW', downloads: 0, continent: 'África',     name: 'Malawi'},
  {code: 'MV', downloads: 0, continent: 'Asia',       name: 'Maldivas'},
  {code: 'ML', downloads: 0, continent: 'África',     name: 'Malí'},
  {code: 'MT', downloads: 0, continent: 'Europa',     name: 'Malta'},
  {code: 'FK', downloads: 0, continent: 'América',    name: 'Islas Malvinas'},
  {code: 'IM', downloads: 0, continent: 'Europa',     name: 'Isla de Man'},
  {code: 'MP', downloads: 0, continent: 'Oceanía',    name: 'Islas Marianas del Norte'},
  {code: 'MA', downloads: 0, continent: 'África',     name: 'Marruecos'},
  {code: 'MH', downloads: 0, continent: 'Oceanía',    name: 'Islas Marshall'},
  {code: 'MQ', downloads: 0, continent: 'América',    name: 'Martinica'},
  {code: 'MU', downloads: 0, continent: 'África',     name: 'Mauricio'},
  {code: 'MR', downloads: 0, continent: 'África',     name: 'Mauritania'},
  {code: 'YT', downloads: 0, continent: 'África',     name: 'Mayotte'},
  {code: 'MX', downloads: 0, continent: 'América',    name: 'México'},
  {code: 'FM', downloads: 0, continent: 'Oceanía',    name: 'Micronesia'},
  {code: 'MD', downloads: 0, continent: 'Europa',     name: 'Moldavia'},
  {code: 'MC', downloads: 0, continent: 'Europa',     name: 'Mónaco'},
  {code: 'MN', downloads: 0, continent: 'Asia',       name: 'Mongolia'},
  {code: 'ME', downloads: 0, continent: 'Europa',     name: 'Montenegro'},
  {code: 'MS', downloads: 0, continent: 'América',    name: 'Montserrat'},
  {code: 'MZ', downloads: 0, continent: 'África',     name: 'Mozambique'},
  {code: 'MM', downloads: 0, continent: 'Asia',       name: 'Myanmar'},

  {code: 'NA', downloads: 0, continent: 'África',     name: 'Namibia'},
  {code: 'NR', downloads: 0, continent: 'Oceanía',    name: 'Nauru'},
  {code: 'CX', downloads: 0, continent: 'Asia',       name: 'Isla de Navidad'},
  {code: 'NP', downloads: 0, continent: 'Asia',       name: 'Nepal'},
  {code: 'NI', downloads: 0, continent: 'América',    name: 'Nicaragua'},
  {code: 'NE', downloads: 0, continent: 'África',     name: 'Níger'},
  {code: 'NG', downloads: 0, continent: 'África',     name: 'Nigeria'},
  {code: 'NU', downloads: 0, continent: 'Oceanía',    name: 'Niue'},
  {code: 'NF', downloads: 0, continent: 'Oceanía',    name: 'Norfolk'},
  {code: 'NO', downloads: 0, continent: 'Europa',     name: 'Noruega'},
  {code: 'NC', downloads: 0, continent: 'Oceanía',    name: 'Nueva Caledonia'},
  {code: 'NZ', downloads: 0, continent: 'Oceanía',    name: 'Nueva Zelanda'},

  {code: 'OM', downloads: 0, continent: 'Asia',       name: 'Omán'},

  {code: 'NL', downloads: 0, continent: 'Europa',     name: 'Países Bajos'},
  {code: 'PK', downloads: 0, continent: 'Asia',       name: 'Pakistán'},
  {code: 'PW', downloads: 0, continent: 'Oceanía',    name: 'Palaos'},
  {code: 'PS', downloads: 0, continent: 'Asia',       name: 'Palestina (ANP)'},
  {code: 'PA', downloads: 0, continent: 'América',    name: 'Panamá'},
  {code: 'PG', downloads: 0, continent: 'Oceanía',    name: 'Papúa Nueva Guinea'},
  {code: 'PY', downloads: 0, continent: 'América',    name: 'Paraguay'},
  {code: 'PE', downloads: 0, continent: 'América',    name: 'Perú'},
  {code: 'PN', downloads: 0, continent: 'Oceanía',    name: 'Islas Pitcairn'},
  {code: 'PF', downloads: 0, continent: 'Oceanía',    name: 'Polinesia Francesa'},
  {code: 'PL', downloads: 0, continent: 'Europa',     name: 'Polonia'},
  {code: 'PT', downloads: 0, continent: 'Europa',     name: 'Portugal'},
  {code: 'PR', downloads: 0, continent: 'América',    name: 'Puerto Rico'},

  {code: 'QA', downloads: 0, continent: 'Asia',       name: 'Qatar'},

  {code: 'GB', downloads: 0, continent: 'Europa',     name: 'Reino Unido'},
  {code: 'RE', downloads: 0, continent: 'África',     name: 'Reunión'},
  {code: 'RW', downloads: 0, continent: 'África',     name: 'Ruanda'},
  {code: 'RO', downloads: 0, continent: 'Europa',     name: 'Rumania'},
  {code: 'RU', downloads: 0, continent: 'Europa',     name: 'Rusia'},

  {code: 'EH', downloads: 0, continent: 'África',     name: 'Sahara Occidental'},
  {code: 'SB', downloads: 0, continent: 'Oceanía',    name: 'Islas Salomón'},
  {code: 'WS', downloads: 0, continent: 'Oceanía',    name: 'Samoa'},
  {code: 'AS', downloads: 0, continent: 'Oceanía',    name: 'Samoa Americana'},
  {code: 'KN', downloads: 0, continent: 'América',    name: 'San Cristóbal y Nieves'},
  {code: 'SM', downloads: 0, continent: 'Europa',     name: 'San Marino'},
  {code: 'PM', downloads: 0, continent: 'América',    name: 'San Pedro y Miquelón'},
  {code: 'VC', downloads: 0, continent: 'América',    name: 'San Vicente y las Granadinas'},
  {code: 'SH', downloads: 0, continent: 'África',     name: 'Santa Helena'},
  {code: 'LC', downloads: 0, continent: 'América',    name: 'Santa Lucía'},
  {code: 'ST', downloads: 0, continent: 'África',     name: 'Santo Tomé y Príncipe'},
  {code: 'SN', downloads: 0, continent: 'África',     name: 'Senegal'},
  {code: 'RS', downloads: 0, continent: 'Europa',     name: 'Serbia'},
  {code: 'SC', downloads: 0, continent: 'África',     name: 'Seychelles'},
  {code: 'SL', downloads: 0, continent: 'África',     name: 'Sierra Leona'},
  {code: 'SG', downloads: 0, continent: 'Asia',       name: 'Singapur'},
  {code: 'SY', downloads: 0, continent: 'Asia',       name: 'Siria'},
  {code: 'SO', downloads: 0, continent: 'África',     name: 'Somalia'},
  {code: 'LK', downloads: 0, continent: 'Asia',       name: 'Sri Lanka'},
  {code: 'SZ', downloads: 0, continent: 'África',     name: 'Suazilandia'},
  {code: 'ZA', downloads: 0, continent: 'África',     name: 'Sudáfrica'},
  {code: 'SD', downloads: 0, continent: 'África',     name: 'Sudán'},
  {code: 'SE', downloads: 0, continent: 'Europa',     name: 'Suecia'},
  {code: 'CH', downloads: 0, continent: 'Europa',     name: 'Suiza'},
  {code: 'SR', downloads: 0, continent: 'América',    name: 'Surinam'},
  {code: 'SJ', downloads: 0, continent: 'Europa',     name: 'Svalbard y Jan Mayen'},

  {code: 'TH', downloads: 0, continent: 'Asia',       name: 'Tailandia'},
  {code: 'TW', downloads: 0, continent: 'Asia',       name: 'Taiwán'},
  {code: 'TZ', downloads: 0, continent: 'África',     name: 'Tanzania'},
  {code: 'TJ', downloads: 0, continent: 'Asia',       name: 'Tayikistán'},
  {code: 'IO', downloads: 0, continent: 'Asia',       name: 'Territorio Británico del Océano Índico'},
  {code: 'TF', downloads: 0, continent: 'Antártida',  name: 'Territorios Australes Franceses'},
  {code: 'TL', downloads: 0, continent: 'Asia',       name: 'Timor Oriental'},
  {code: 'TG', downloads: 0, continent: 'África',     name: 'Togo'},
  {code: 'TK', downloads: 0, continent: 'Oceanía',    name: 'Tokelau'},
  {code: 'TO', downloads: 0, continent: 'Oceanía',    name: 'Tonga'},
  {code: 'TT', downloads: 0, continent: 'América',    name: 'Trinidad y Tobago'},
  {code: 'TN', downloads: 0, continent: 'África',     name: 'Túnez'},
  {code: 'TC', downloads: 0, continent: 'América',    name: 'Islas Turcas y Caicos'},
  {code: 'TM', downloads: 0, continent: 'Asia',       name: 'Turkmenistán'},
  {code: 'TR', downloads: 0, continent: 'Europa',     name: 'Turquía'},
  {code: 'TV', downloads: 0, continent: 'Oceanía',    name: 'Tuvalu'},

  {code: 'UA', downloads: 0, continent: 'Europa',     name: 'Ucrania'},
  {code: 'UG', downloads: 0, continent: 'África',     name: 'Uganda'},
  {code: 'EU', downloads: 0, continent: 'Europa',     name: 'Unión Europea'},
  {code: 'UY', downloads: 0, continent: 'América',    name: 'Uruguay'},
  {code: 'UZ', downloads: 0, continent: 'Asia',       name: 'Uzbekistán'},

  {code: 'VU', downloads: 0, continent: 'Oceanía',    name: 'Vanuatu'},
  {code: 'VA', downloads: 0, continent: 'Europa',     name: 'Ciudad del Vaticano'},
  {code: 'VE', downloads: 0, continent: 'América',    name: 'Venezuela'},
  {code: 'VN', downloads: 0, continent: 'Asia',       name: 'Vietnam'},
  {code: 'VG', downloads: 0, continent: 'América',    name: 'Islas Vírgenes Británicas'},
  {code: 'VI', downloads: 0, continent: 'América',    name: 'Islas Vírgenes Estadounidenses'},

  {code: 'WF', downloads: 0, continent: 'Oceanía',    name: 'Wallis y Futuna'},

  {code: 'YE', downloads: 0, continent: 'Asia',       name: 'Yemen'},
  {code: 'DJ', downloads: 0, continent: 'África',     name: 'Yibuti'},

  {code: 'ZM', downloads: 0, continent: 'África',     name: 'Zambia'},
  {code: 'ZW', downloads: 0, continent: 'África',     name: 'Zimbabue'}
];

var countriesObj_ = {
  'UNK': {downloads: 0, name: 'Desconocido'},
  'AF': {downloads: 0, name: 'Afganistán'},
  'AX': {downloads: 0, name: 'Aland'},
  'AL': {downloads: 0, name: 'Albania'},
  'DE': {downloads: 0, name: 'Alemania'},
  'AD': {downloads: 0, name: 'Andorra'},
  'AO': {downloads: 0, name: 'Angola'},
  'AI': {downloads: 0, name: 'Anguila'},
  'AQ': {downloads: 0, name: 'Antártida'},
  'AG': {downloads: 0, name: 'Antigua y Barbuda'},
  'AN': {downloads: 0, name: 'Antillas Neerlandesas'},
  'SA': {downloads: 0, name: 'Arabia Saudita'},
  'DZ': {downloads: 0, name: 'Argelia'},
  'AR': {downloads: 0, name: 'Argentina'},
  'AM': {downloads: 0, name: 'Armenia'},
  'AW': {downloads: 0, name: 'Aruba'},
  'AU': {downloads: 0, name: 'Australia'},
  'AT': {downloads: 0, name: 'Austria'},
  'AZ': {downloads: 0, name: 'Azerbaiyán'},

  'BS': {downloads: 0, name: 'Bahamas'},
  'BH': {downloads: 0, name: 'Bahréin'},
  'BD': {downloads: 0, name: 'Bangladesh'},
  'BB': {downloads: 0, name: 'Barbados'},
  'BY': {downloads: 0, name: 'Bielorrusia'},
  'BE': {downloads: 0, name: 'Bélgica'},
  'BZ': {downloads: 0, name: 'Belice'},
  'BJ': {downloads: 0, name: 'Benín'},
  'BM': {downloads: 0, name: 'Bermudas'},
  'BT': {downloads: 0, name: 'Bután'},
  'BO': {downloads: 0, name: 'Bolivia'},
  'BA': {downloads: 0, name: 'Bosnia y Herzegovina'},
  'BW': {downloads: 0, name: 'Botsuana'},
  'BV': {downloads: 0, name: 'Isla Bouvet'},
  'BR': {downloads: 0, name: 'Brasil'},
  'BN': {downloads: 0, name: 'Brunéi'},
  'BG': {downloads: 0, name: 'Bulgaria'},
  'BF': {downloads: 0, name: 'Burkina Faso'},
  'BI': {downloads: 0, name: 'Burundi'},

  'CV': {downloads: 0, name: 'Cabo Verde'},
  'KY': {downloads: 0, name: 'Islas Caimán'},
  'KH': {downloads: 0, name: 'Camboya'},
  'CM': {downloads: 0, name: 'Camerún'},
  'CA': {downloads: 0, name: 'Canadá'},
  'CF': {downloads: 0, name: 'República Centroafricana'},
  'TD': {downloads: 0, name: 'Chad'},
  'CZ': {downloads: 0, name: 'República Checa'},
  'CL': {downloads: 0, name: 'Chile'},
  'CN': {downloads: 0, name: 'China'},
  'CY': {downloads: 0, name: 'Chipre'},
  'CC': {downloads: 0, name: 'Islas Cocos'},
  'CO': {downloads: 0, name: 'Colombia'},
  'KM': {downloads: 0, name: 'Comoras'},
  'CG': {downloads: 0, name: 'República del Congo'},
  'CD': {downloads: 0, name: 'República Democrática del Congo'},
  'CK': {downloads: 0, name: 'Islas Cook'},
  'KP': {downloads: 0, name: 'Corea del Norte'},
  'KR': {downloads: 0, name: 'Corea del Sur'},
  'CI': {downloads: 0, name: 'Costa de Marfil'},
  'CR': {downloads: 0, name: 'Costa Rica'},
  'HR': {downloads: 0, name: 'Croacia'},
  'CU': {downloads: 0, name: 'Cuba'},

  'DK': {downloads: 0, name: 'Dinamarca'},
  'DM': {downloads: 0, name: 'Dominica'},
  'DO': {downloads: 0, name: 'República Dominicana'},

  'EC': {downloads: 0, name: 'Ecuador'},
  'EG': {downloads: 0, name: 'Egipto'},
  'SV': {downloads: 0, name: 'El Salvador'},
  'AE': {downloads: 0, name: 'Emiratos Árabes Unidos'},
  'ER': {downloads: 0, name: 'Eritrea'},
  'SK': {downloads: 0, name: 'Eslovaquia'},
  'SI': {downloads: 0, name: 'Eslovenia'},
  'ES': {downloads: 0, name: 'España'},
  'EA': {downloads: 0, name: 'España (Ceuta y Melilla)'},
  'US': {downloads: 0, name: 'Estados Unidos'},
  'UM': {downloads: 0, name: 'Islas ultramarinas de Estados Unidos'},
  'EE': {downloads: 0, name: 'Estonia'},
  'ET': {downloads: 0, name: 'Etiopía'},

  'FO': {downloads: 0, name: 'Islas Feroe'},
  'PH': {downloads: 0, name: 'Filipinas'},
  'FI': {downloads: 0, name: 'Finlandia'},
  'FJ': {downloads: 0, name: 'Fiyi'},
  'FR': {downloads: 0, name: 'Francia'},

  'GA': {downloads: 0, name: 'Gabón'},
  'GM': {downloads: 0, name: 'Gambia'},
  'GE': {downloads: 0, name: 'Georgia'},
  'GS': {downloads: 0, name: 'Islas Georgias del Sur y Sandwich del Sur'},
  'GH': {downloads: 0, name: 'Ghana'},
  'GI': {downloads: 0, name: 'Gibraltar'},
  'GD': {downloads: 0, name: 'Granada'},
  'GR': {downloads: 0, name: 'Grecia'},
  'GL': {downloads: 0, name: 'Groenlandia'},
  'GP': {downloads: 0, name: 'Guadalupe'},
  'GU': {downloads: 0, name: 'Guam'},
  'GT': {downloads: 0, name: 'Guatemala'},
  'GF': {downloads: 0, name: 'Guayana Francesa'},
  'GG': {downloads: 0, name: 'Guernsey'},
  'GN': {downloads: 0, name: 'Guinea'},
  'GQ': {downloads: 0, name: 'Guinea Ecuatorial'},
  'GW': {downloads: 0, name: 'Guinea-Bissau'},
  'GY': {downloads: 0, name: 'Guyana'},

  'HT': {downloads: 0, name: 'Haití'},
  'HM': {downloads: 0, name: 'Islas Heard y McDonald'},
  'HN': {downloads: 0, name: 'Honduras'},
  'HK': {downloads: 0, name: 'Hong Kong'},
  'HU': {downloads: 0, name: 'Hungría'},

  'IN': {downloads: 0, name: 'India'},
  'ID': {downloads: 0, name: 'Indonesia'},
  'IR': {downloads: 0, name: 'Irán'},
  'IQ': {downloads: 0, name: 'Iraq'},
  'IE': {downloads: 0, name: 'Irlanda'},
  'IS': {downloads: 0, name: 'Islandia'},
  'IL': {downloads: 0, name: 'Israel'},
  'IT': {downloads: 0, name: 'Italia'},

  'JM': {downloads: 0, name: 'Jamaica'},
  'JP': {downloads: 0, name: 'Japón'},
  'JE': {downloads: 0, name: 'Jersey'},
  'JO': {downloads: 0, name: 'Jordania'},

  'KZ': {downloads: 0, name: 'Kazajistán'},
  'KE': {downloads: 0, name: 'Kenia'},
  'KG': {downloads: 0, name: 'Kirguistán'},
  'KI': {downloads: 0, name: 'Kiribati'},
  'KW': {downloads: 0, name: 'Kuwait'},

  'LA': {downloads: 0, name: 'Laos'},
  'LS': {downloads: 0, name: 'Lesoto'},
  'LV': {downloads: 0, name: 'Letonia'},
  'LB': {downloads: 0, name: 'Líbano'},
  'LR': {downloads: 0, name: 'Liberia'},
  'LY': {downloads: 0, name: 'Libia'},
  'LI': {downloads: 0, name: 'Liechtenstein'},
  'LT': {downloads: 0, name: 'Lituania'},
  'LU': {downloads: 0, name: 'Luxemburgo'},

  'MO': {downloads: 0, name: 'Macao'},
  'MK': {downloads: 0, name: 'ARY Macedonia'},
  'MG': {downloads: 0, name: 'Madagascar'},
  'MY': {downloads: 0, name: 'Malasia'},
  'MW': {downloads: 0, name: 'Malawi'},
  'MV': {downloads: 0, name: 'Maldivas'},
  'ML': {downloads: 0, name: 'Malí'},
  'MT': {downloads: 0, name: 'Malta'},
  'FK': {downloads: 0, name: 'Islas Malvinas'},
  'IM': {downloads: 0, name: 'Isla de Man'},
  'MP': {downloads: 0, name: 'Islas Marianas del Norte'},
  'MA': {downloads: 0, name: 'Marruecos'},
  'MH': {downloads: 0, name: 'Islas Marshall'},
  'MQ': {downloads: 0, name: 'Martinica'},
  'MU': {downloads: 0, name: 'Mauricio'},
  'MR': {downloads: 0, name: 'Mauritania'},
  'YT': {downloads: 0, name: 'Mayotte'},
  'MX': {downloads: 0, name: 'México'},
  'FM': {downloads: 0, name: 'Micronesia'},
  'MD': {downloads: 0, name: 'Moldavia'},
  'MC': {downloads: 0, name: 'Mónaco'},
  'MN': {downloads: 0, name: 'Mongolia'},
  'ME': {downloads: 0, name: 'Montenegro'},
  'MS': {downloads: 0, name: 'Montserrat'},
  'MZ': {downloads: 0, name: 'Mozambique'},
  'MM': {downloads: 0, name: 'Myanmar'},

  'NA': {downloads: 0, name: 'Namibia'},
  'NR': {downloads: 0, name: 'Nauru'},
  'CX': {downloads: 0, name: 'Isla de Navidad'},
  'NP': {downloads: 0, name: 'Nepal'},
  'NI': {downloads: 0, name: 'Nicaragua'},
  'NE': {downloads: 0, name: 'Níger'},
  'NG': {downloads: 0, name: 'Nigeria'},
  'NU': {downloads: 0, name: 'Niue'},
  'NF': {downloads: 0, name: 'Norfolk'},
  'NO': {downloads: 0, name: 'Noruega'},
  'NC': {downloads: 0, name: 'Nueva Caledonia'},
  'NZ': {downloads: 0, name: 'Nueva Zelanda'},

  'OM': {downloads: 0, name: 'Omán'},

  'NL': {downloads: 0, name: 'Países Bajos'},
  'PK': {downloads: 0, name: 'Pakistán'},
  'PW': {downloads: 0, name: 'Palaos'},
  'PS': {downloads: 0, name: 'Palestina (ANP)'},
  'PA': {downloads: 0, name: 'Panamá'},
  'PG': {downloads: 0, name: 'Papúa Nueva Guinea'},
  'PY': {downloads: 0, name: 'Paraguay'},
  'PE': {downloads: 0, name: 'Perú'},
  'PN': {downloads: 0, name: 'Islas Pitcairn'},
  'PF': {downloads: 0, name: 'Polinesia Francesa'},
  'PL': {downloads: 0, name: 'Polonia'},
  'PT': {downloads: 0, name: 'Portugal'},
  'PR': {downloads: 0, name: 'Puerto Rico'},

  'QA': {downloads: 0, name: 'Qatar'},

  'GB': {downloads: 0, name: 'Reino Unido'},
  'RE': {downloads: 0, name: 'Reunión'},
  'RW': {downloads: 0, name: 'Ruanda'},
  'RO': {downloads: 0, name: 'Rumania'},
  'RU': {downloads: 0, name: 'Rusia'},

  'EH': {downloads: 0, name: 'Sahara Occidental'},
  'SB': {downloads: 0, name: 'Islas Salomón'},
  'WS': {downloads: 0, name: 'Samoa'},
  'AS': {downloads: 0, name: 'Samoa Americana'},
  'KN': {downloads: 0, name: 'San Cristóbal y Nieves'},
  'SM': {downloads: 0, name: 'San Marino'},
  'PM': {downloads: 0, name: 'San Pedro y Miquelón'},
  'VC': {downloads: 0, name: 'San Vicente y las Granadinas'},
  'SH': {downloads: 0, name: 'Santa Helena'},
  'LC': {downloads: 0, name: 'Santa Lucía'},
  'ST': {downloads: 0, name: 'Santo Tomé y Príncipe'},
  'SN': {downloads: 0, name: 'Senegal'},
  'RS': {downloads: 0, name: 'Serbia'},
  'SC': {downloads: 0, name: 'Seychelles'},
  'SL': {downloads: 0, name: 'Sierra Leona'},
  'SG': {downloads: 0, name: 'Singapur'},
  'SY': {downloads: 0, name: 'Siria'},
  'SO': {downloads: 0, name: 'Somalia'},
  'LK': {downloads: 0, name: 'Sri Lanka'},
  'SZ': {downloads: 0, name: 'Suazilandia'},
  'ZA': {downloads: 0, name: 'Sudáfrica'},
  'SD': {downloads: 0, name: 'Sudán'},
  'SE': {downloads: 0, name: 'Suecia'},
  'CH': {downloads: 0, name: 'Suiza'},
  'SR': {downloads: 0, name: 'Surinam'},
  'SJ': {downloads: 0, name: 'Svalbard y Jan Mayen'},

  'TH': {downloads: 0, name: 'Tailandia'},
  'TW': {downloads: 0, name: 'Taiwán'},
  'TZ': {downloads: 0, name: 'Tanzania'},
  'TJ': {downloads: 0, name: 'Tayikistán'},
  'IO': {downloads: 0, name: 'Territorio Británico del Océano Índico'},
  'TF': {downloads: 0, name: 'Territorios Australes Franceses'},
  'TL': {downloads: 0, name: 'Timor Oriental'},
  'TG': {downloads: 0, name: 'Togo'},
  'TK': {downloads: 0, name: 'Tokelau'},
  'TO': {downloads: 0, name: 'Tonga'},
  'TT': {downloads: 0, name: 'Trinidad y Tobago'},
  'TN': {downloads: 0, name: 'Túnez'},
  'TC': {downloads: 0, name: 'Islas Turcas y Caicos'},
  'TM': {downloads: 0, name: 'Turkmenistán'},
  'TR': {downloads: 0, name: 'Turquía'},
  'TV': {downloads: 0, name: 'Tuvalu'},

  'UA': {downloads: 0, name: 'Ucrania'},
  'UG': {downloads: 0, name: 'Uganda'},
  'EU': {downloads: 0, name: 'Unión Europea'},
  'UY': {downloads: 0, name: 'Uruguay'},
  'UZ': {downloads: 0, name: 'Uzbekistán'},

  'VU': {downloads: 0, name: 'Vanuatu'},
  'VA': {downloads: 0, name: 'Ciudad del Vaticano'},
  'VE': {downloads: 0, name: 'Venezuela'},
  'VN': {downloads: 0, name: 'Vietnam'},
  'VG': {downloads: 0, name: 'Islas Vírgenes Británicas'},
  'VI': {downloads: 0, name: 'Islas Vírgenes Estadounidenses'},

  'WF': {downloads: 0, name: 'Wallis y Futuna'},

  'YE': {downloads: 0, name: 'Yemen'},
  'DJ': {downloads: 0, name: 'Yibuti'},

  'ZM': {downloads: 0, name: 'Zambia'},
  'ZW': {downloads: 0, name: 'Zimbabue'}
};
