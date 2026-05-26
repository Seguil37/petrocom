<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('project_images')->delete();
        DB::table('project_reviews')->delete();
        DB::table('favorites')->delete();
        DB::table('projects')->delete();

        $gasStationImage = 'https://images.unsplash.com/photo-1727483892297-56448c8f1af1?auto=format&fit=crop&w=1200&q=80';
        $tankerImage = 'https://images.unsplash.com/photo-1768637656191-133fe8f95786?auto=format&fit=crop&w=1200&q=80';
        $now = now();

        $projects = [
            [
                'title' => 'Estaciones de servicio',
                'type' => 'Expediente tecnico',
                'summary' => 'Gestion documental y soporte tecnico para instalacion, modificacion o regularizacion de estaciones de servicio.',
                'description' => 'Categoria de proyectos orientada a expedientes tecnicos para estaciones de servicio, incluyendo distribucion, almacenamiento, despacho, seguridad y seguimiento de observaciones.',
                'image' => $gasStationImage,
            ],
            [
                'title' => 'Grifos rurales',
                'type' => 'Gestion documental',
                'summary' => 'Asesoria para grifos rurales y establecimientos de venta de combustibles con enfoque tecnico y normativo.',
                'description' => 'Soporte para ordenar requisitos, planos, memorias y documentos relacionados con grifos rurales o establecimientos de combustibles en zonas no urbanas.',
                'image' => $gasStationImage,
            ],
            [
                'title' => 'Gasocentros de GLP',
                'type' => 'Asesoria tecnica',
                'summary' => 'Revision y elaboracion de documentos para gasocentros e instalaciones vinculadas al GLP.',
                'description' => 'Acompanamiento para proyectos de gasocentros de GLP, locales de venta, almacenamiento, despacho y requisitos tecnicos asociados.',
                'image' => $gasStationImage,
            ],
            [
                'title' => 'Consumidores directos',
                'type' => 'Regularizacion',
                'summary' => 'Expedientes para empresas que almacenan y consumen combustibles liquidos o GLP para operacion propia.',
                'description' => 'Categoria enfocada en consumidores directos, con revision de capacidad de almacenamiento, condiciones de seguridad, matrices de riesgo y documentacion de soporte.',
                'image' => $tankerImage,
            ],
            [
                'title' => 'Locales de venta de GLP',
                'type' => 'Gestion documental',
                'summary' => 'Documentacion tecnica para locales de venta de GLP y cumplimiento de requisitos aplicables.',
                'description' => 'Soporte para titulares de locales de venta de GLP en la preparacion de documentos, planos, condiciones de seguridad y subsanaciones.',
                'image' => $gasStationImage,
            ],
            [
                'title' => 'Transporte de combustibles',
                'type' => 'Expediente tecnico',
                'summary' => 'Documentacion para unidades y operaciones de transporte terrestre de combustibles y materiales peligrosos.',
                'description' => 'Elaboracion de planes, matrices, informacion de unidades, rutas, condiciones operativas y documentos para transporte de combustibles.',
                'image' => $tankerImage,
            ],
            [
                'title' => 'Almacenamiento de combustibles',
                'type' => 'Asesoria tecnica',
                'summary' => 'Revision tecnica para instalaciones, tanques, zonas de descarga y condiciones de almacenamiento.',
                'description' => 'Categoria para proyectos vinculados a almacenamiento de combustibles, revision de instalaciones, medidas de seguridad y documentacion complementaria.',
                'image' => $tankerImage,
            ],
            [
                'title' => 'Levantamiento de observaciones OSINERGMIN',
                'type' => 'Levantamiento de observaciones',
                'summary' => 'Subsanacion tecnica y documental de expedientes observados por entidades competentes.',
                'description' => 'Analisis de observaciones, preparacion de descargos, correccion de planos, memorias complementarias y seguimiento de subsanaciones.',
                'image' => $gasStationImage,
            ],
            [
                'title' => 'Planes de contingencia para hidrocarburos',
                'type' => 'Seguridad y cumplimiento',
                'summary' => 'Planes de contingencia, matrices de riesgo y protocolos de emergencia para actividades de hidrocarburos.',
                'description' => 'Desarrollo de documentos de respuesta ante emergencias, identificacion de riesgos, medidas de control, senalizacion y procedimientos operativos.',
                'image' => $tankerImage,
            ],
        ];

        DB::table('projects')->insert(array_map(function (array $project, int $index) use ($now) {
            return [
                'title' => $project['title'],
                'slug' => Str::slug($project['title']),
                'type' => $project['type'],
                'city' => 'Huancayo',
                'state' => 'Junin',
                'country' => 'Peru',
                'is_featured' => $index < 4,
                'hero_image' => $project['image'],
                'status' => 'published',
                'published_at' => $now,
                'summary' => $project['summary'],
                'description' => $project['description'],
                'metadata' => null,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ];
        }, $projects, array_keys($projects)));
    }
}
