<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Master Admin',
                'email' => 'seguilso37@gmail.com',
                'password' => Hash::make('mychemicalromance37'),
                'role' => 'master_admin',
                'city' => 'Lima',
                'state' => 'Lima',
                'country' => 'Peru',
            ],
            [
                'name' => 'Admin Principal',
                'email' => 'ioseguil@gmail.com',
                'password' => Hash::make('mychemicalromance37'),
                'role' => 'admin',
                'city' => 'Huancayo',
                'state' => 'Junin',
                'country' => 'Peru',
            ],
            [
                'name' => 'Cliente Demo',
                'email' => 'jhojanvidal321@gmail.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'city' => 'Huancayo',
                'state' => 'Junin',
                'country' => 'Peru',
            ],
            [
                'name' => 'Operativo Demo',
                'email' => 'operativo@demo.com',
                'password' => Hash::make('password'),
                'role' => 'operator',
                'city' => 'Huancayo',
                'state' => 'Junin',
                'country' => 'Peru',
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
