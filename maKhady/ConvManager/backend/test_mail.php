<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Notification;
use App\Models\User;
use App\Models\Convention;
use App\Notifications\ConventionStatusChanged;

$user = User::where('email', 'admin@convmanager.com')->first() ?: User::first();
$convention = Convention::first();

if ($user && $convention) {
    try {
        Notification::send($user, new ConventionStatusChanged($convention, 'soumis', $user));
        echo "\nSUCCESS: Email envoyé à " . $user->email . "\n";
    } catch (\Exception $e) {
        echo "\nERROR: " . $e->getMessage() . "\n";
    }
} else {
    echo "\nERROR: Utilisateur ou Convention introuvable.\n";
}
