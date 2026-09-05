<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ServicesTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('service_images')->delete();
        DB::table('services')->delete();

        $gasStationImage = 'https://images.unsplash.com/photo-1727483892297-56448c8f1af1?auto=format&fit=crop&w=1200&q=80';
        $tankerImage = 'https://images.unsplash.com/photo-1768637656191-133fe8f95786?auto=format&fit=crop&w=1200&q=80';
        $now = now();

        $services = [
            [
                'title' => 'Informe Tecnico Favorable - ITF',
                'category' => 'ITF y expedientes tecnicos',
                'short_description' => 'Elaboramos y gestionamos expedientes tecnicos para instalacion, modificacion o ampliacion de establecimientos de combustibles liquidos, GLP y actividades del sector hidrocarburos.',
                'description' => 'Preparamos la documentacion tecnica requerida para solicitar el Informe Tecnico Favorable - ITF en proyectos vinculados a combustibles liquidos, GLP, estaciones de servicio, gasocentros, consumidores directos y otras instalaciones del sector hidrocarburos. El servicio incluye revision de requisitos, planos, memorias, evaluacion de seguridad y seguimiento del expediente hasta su presentacion y control de observaciones.',
                'featured' => true,
                'cover_image' => $gasStationImage,
            ],
            [
                'title' => 'Registro de Hidrocarburos',
                'category' => 'Registro de Hidrocarburos',
                'short_description' => 'Asesoramos en la inscripcion, modificacion y actualizacion del Registro de Hidrocarburos ante OSINERGMIN segun actividad y establecimiento.',
                'description' => 'Acompañamos a empresas y titulares en procesos de inscripcion, modificacion y actualizacion del Registro de Hidrocarburos. Revisamos la actividad aplicable, ordenamos la documentacion, verificamos requisitos tecnicos y damos seguimiento a observaciones hasta contar con un expediente coherente para la entidad competente.',
                'featured' => true,
                'cover_image' => $gasStationImage,
            ],
            [
                'title' => 'Grifos y estaciones de servicio',
                'category' => 'Estaciones de servicio',
                'short_description' => 'Desarrollamos documentacion tecnica para grifos, estaciones de servicio, ampliaciones, modificaciones, regularizaciones y levantamiento de observaciones.',
                'description' => 'Brindamos soporte tecnico y documental para proyectos de grifos y estaciones de servicio, incluyendo distribucion de areas, ubicacion de tanques, islas de despacho, venteos, zonas de descarga, distancias de seguridad y coordinacion de requisitos aplicables al proyecto.',
                'featured' => true,
                'cover_image' => $gasStationImage,
            ],
            [
                'title' => 'Gasocentros y GLP',
                'category' => 'GLP',
                'short_description' => 'Soporte tecnico para gasocentros de GLP, locales de venta de GLP, consumidores directos de GLP e instalaciones de almacenamiento y despacho.',
                'description' => 'Elaboramos y revisamos expedientes para actividades vinculadas a GLP, incluyendo gasocentros, locales de venta, consumidores directos e instalaciones de almacenamiento. El enfoque prioriza seguridad, cumplimiento tecnico y claridad documental.',
                'featured' => false,
                'cover_image' => $gasStationImage,
            ],
            [
                'title' => 'Consumidores directos',
                'category' => 'Consumidores directos',
                'short_description' => 'Asesoramos a empresas que requieren almacenamiento y consumo propio de combustibles liquidos, GLP u otros derivados de hidrocarburos.',
                'description' => 'Gestionamos documentacion para consumidores directos de combustibles, revisando la actividad, capacidad de almacenamiento, condiciones de seguridad, matrices de riesgo y sustentos tecnicos necesarios para ordenar el expediente.',
                'featured' => false,
                'cover_image' => $tankerImage,
            ],
            [
                'title' => 'Transporte de combustibles',
                'category' => 'Transporte de combustibles',
                'short_description' => 'Elaboramos documentacion tecnica, planes de contingencia, matrices de riesgo y requisitos para unidades de transporte terrestre de combustibles y materiales peligrosos.',
                'description' => 'Preparamos expedientes y documentos de soporte para medios de transporte de combustibles liquidos, GLP y otros productos derivados de hidrocarburos, considerando rutas, condiciones operativas, seguridad, contingencias y trazabilidad documental.',
                'featured' => true,
                'cover_image' => $tankerImage,
            ],
            [
                'title' => 'Planes de contingencia y matrices de riesgo',
                'category' => 'Seguridad y cumplimiento',
                'short_description' => 'Preparamos planes de contingencia, analisis de riesgos, medidas de control, protocolos de emergencia, señalización y procedimientos operativos.',
                'description' => 'Desarrollamos documentos de gestion de riesgos para actividades de hidrocarburos, incluyendo identificacion de peligros, medidas de control, respuesta ante emergencias, señalización, equipos criticos y procedimientos operativos.',
                'featured' => false,
                'cover_image' => $tankerImage,
            ],
            [
                'title' => 'Levantamiento de observaciones',
                'category' => 'Subsanaciones tecnicas',
                'short_description' => 'Revisamos expedientes observados por entidades competentes y elaboramos descargos tecnicos, subsanaciones, planos corregidos y memorias complementarias.',
                'description' => 'Analizamos observaciones emitidas durante evaluaciones tecnicas, identificamos brechas del expediente y preparamos respuestas sustentadas, planos corregidos, memorias complementarias y documentos de subsanacion.',
                'featured' => false,
                'cover_image' => $gasStationImage,
            ],
            [
                'title' => 'Planos, memorias e informes tecnicos',
                'category' => 'Documentacion tecnica',
                'short_description' => 'Elaboramos planos de distribucion, instalaciones mecanicas, electricas, tanques, tuberias, venteos, islas, zonas de descarga y distancias de seguridad.',
                'description' => 'Desarrollamos planos, memorias descriptivas, informes tecnicos y documentos complementarios para proyectos de hidrocarburos. El objetivo es presentar informacion clara, coherente y alineada con la finalidad del tramite.',
                'featured' => false,
                'cover_image' => $gasStationImage,
            ],
        ];

        DB::table('services')->insert(array_map(function (array $service) use ($now) {
            return [
                'title' => $service['title'],
                'slug' => Str::slug($service['title']),
                'category' => $service['category'],
                'short_description' => $service['short_description'],
                'description' => $service['description'],
                'status' => 'published',
                'featured' => $service['featured'],
                'cover_image' => $service['cover_image'],
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ];
        }, $services));
    }
}
