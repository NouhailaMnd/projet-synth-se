<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        $users = [
            ['name' => 'Jean Dupont', 'email' => 'jean@example.com'],
            ['name' => 'Fatima Zahra', 'email' => 'fatima@example.com'],
            ['name' => 'Mamadou Diop', 'email' => 'mamadou@example.com'],
            ['name' => 'Sophie Tremblay', 'email' => 'sophie@example.com'],
            ['name' => 'Ahmed Ben Salah', 'email' => 'ahmed@example.com'],
            ['name' => 'Amina Bouzid', 'email' => 'amina@example.com'],
            ['name' => 'Koffi Kouadio', 'email' => 'koffi@example.com'],
        ];

        foreach ($users as $index => $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'email_verified_at' => now(),
                'password' => Hash::make('password'), // Mot de passe sécurisé
                'remember_token' => Str::random(10),
                'role' => 'prestataire',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
