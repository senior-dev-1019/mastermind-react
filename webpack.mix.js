const mix = require('laravel-mix');
require('dotenv').config();

mix.react('resources/js/Application.js', 'assets/js/app.js')
   .sass('resources/sass/app.scss', 'assets/css');
