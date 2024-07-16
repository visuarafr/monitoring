<?php
/*
Plugin Name: Monitoring App
Description: Intégration d'une application React pour le monitoring.
Version: 1.0
Author: Votre Nom
*/

function enqueue_monitoring_app() {
    // Enqueue the main JS file of the React app
    wp_enqueue_script(
        'monitoring-app-js',
        plugins_url('monitoring/static/js/main.fb9d489a.js', __FILE__),  // Correction ici
        array(),
        null,
        true
    );
    error_log('Monitoring App JS Enqueued'); // Log message
}

// Shortcode to display the React app
function monitoring_app_shortcode() {
    enqueue_monitoring_app();
    error_log('Monitoring App Shortcode Called'); // Log message
    return '<div id="root">Monitoring App is loaded</div>';
}

add_shortcode('monitoring_app', 'monitoring_app_shortcode');

error_log('Monitoring Plugin Loaded'); // Log message to indicate the plugin file is loaded
