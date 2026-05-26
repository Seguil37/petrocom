<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SystemSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Creando configuraciones del sistema PETROCOM...');

        $settings = [
            [
                'key' => 'app_name',
                'value' => 'PETROCOM Energy',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Nombre de la aplicacion',
                'is_public' => true,
            ],
            [
                'key' => 'app_logo',
                'value' => '/images/logo.png',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Logo de la aplicacion',
                'is_public' => true,
            ],
            [
                'key' => 'contact_email',
                'value' => 'iaosoress@gmail.com',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Email de contacto',
                'is_public' => true,
            ],
            [
                'key' => 'contact_phone',
                'value' => '+51 927 985 691',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Telefono de contacto',
                'is_public' => true,
            ],
            [
                'key' => 'whatsapp_number',
                'value' => '51927985691',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Numero de WhatsApp sin simbolos',
                'is_public' => true,
            ],
            [
                'key' => 'company_address',
                'value' => 'Jr. Chiclayo 345, El Tambo, Huancayo, Junin',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Direccion comercial',
                'is_public' => true,
            ],
            [
                'key' => 'facebook_url',
                'value' => 'https://www.facebook.com/profile.php?id=61574640909224',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Pagina de Facebook',
                'is_public' => true,
            ],
            [
                'key' => 'currency',
                'value' => 'PEN',
                'type' => 'string',
                'group' => 'payments',
                'description' => 'Moneda del sistema',
                'is_public' => true,
            ],
            [
                'key' => 'tax_rate',
                'value' => '0.18',
                'type' => 'string',
                'group' => 'payments',
                'description' => 'Tasa de IGV',
                'is_public' => false,
            ],
            [
                'key' => 'commission_rate',
                'value' => '0.10',
                'type' => 'string',
                'group' => 'payments',
                'description' => 'Comision administrativa referencial',
                'is_public' => false,
            ],
            [
                'key' => 'payment_methods',
                'value' => json_encode(['bank_transfer', 'yape', 'plin']),
                'type' => 'json',
                'group' => 'payments',
                'description' => 'Metodos de pago disponibles',
                'is_public' => true,
            ],
            [
                'key' => 'booking_expiration_minutes',
                'value' => '30',
                'type' => 'integer',
                'group' => 'requests',
                'description' => 'Minutos antes de expirar una solicitud pendiente',
                'is_public' => false,
            ],
            [
                'key' => 'default_response_hours',
                'value' => '24',
                'type' => 'integer',
                'group' => 'requests',
                'description' => 'Horas por defecto para atencion inicial',
                'is_public' => true,
            ],
            [
                'key' => 'send_request_reminders',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'requests',
                'description' => 'Enviar recordatorios de solicitud',
                'is_public' => false,
            ],
            [
                'key' => 'reminder_hours_before',
                'value' => '48',
                'type' => 'integer',
                'group' => 'requests',
                'description' => 'Horas antes del vencimiento para enviar recordatorio',
                'is_public' => false,
            ],
            [
                'key' => 'projects_require_approval',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'projects',
                'description' => 'Proyectos publicados requieren aprobacion de admin',
                'is_public' => false,
            ],
            [
                'key' => 'min_project_images',
                'value' => '1',
                'type' => 'integer',
                'group' => 'projects',
                'description' => 'Minimo de imagenes requeridas por proyecto',
                'is_public' => false,
            ],
            [
                'key' => 'featured_projects_count',
                'value' => '8',
                'type' => 'integer',
                'group' => 'projects',
                'description' => 'Cantidad de proyectos destacados en home',
                'is_public' => false,
            ],
            [
                'key' => 'send_welcome_email',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'emails',
                'description' => 'Enviar email de bienvenida al registrarse',
                'is_public' => false,
            ],
            [
                'key' => 'send_request_confirmation',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'emails',
                'description' => 'Enviar email de confirmacion de solicitud',
                'is_public' => false,
            ],
            [
                'key' => 'maintenance_mode',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'maintenance',
                'description' => 'Modo mantenimiento activado',
                'is_public' => true,
            ],
            [
                'key' => 'maintenance_message',
                'value' => 'Estamos realizando mejoras. Volveremos pronto.',
                'type' => 'string',
                'group' => 'maintenance',
                'description' => 'Mensaje de mantenimiento',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('system_settings')->insert(array_merge($setting, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $this->command->info('Configuraciones creadas: ' . count($settings));
    }
}
