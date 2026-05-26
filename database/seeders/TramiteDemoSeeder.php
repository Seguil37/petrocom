<?php

namespace Database\Seeders;

use App\Models\Tramite;
use App\Models\TramitePhase;
use App\Models\TramiteSubphase;
use App\Models\TramiteTask;
use App\Models\TramiteType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TramiteDemoSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $master = User::where('role', 'master_admin')->first();
            $operator = User::where('role', 'operator')->first();
            $client = User::where('role', 'client')->first();

            $type = TramiteType::whereIn('code', ['ITF-ES', 'LIC-OBRA'])->first() ?? new TramiteType();
            $type->fill([
                'code' => 'ITF-ES',
                'name' => 'ITF para estacion de servicio',
                'description' => 'Flujo base para expedientes tecnicos, seguimiento y levantamiento de observaciones ante OSINERGMIN.',
                'is_active' => true,
                'created_by' => $type->created_by ?: $master?->id,
                'updated_by' => $master?->id,
            ])->save();

            $type->phases()->delete();

            $identificacion = TramitePhase::create([
                'tramite_type_id' => $type->id,
                'name' => 'Evaluacion inicial y requisitos',
                'order' => 1,
            ]);
            TramiteSubphase::insert([
                [
                    'tramite_phase_id' => $identificacion->id,
                    'name' => 'Revision de actividad y establecimiento',
                    'order' => 1,
                ],
                [
                    'tramite_phase_id' => $identificacion->id,
                    'name' => 'Checklist documental',
                    'order' => 2,
                ],
            ]);

            $expediente = TramitePhase::create([
                'tramite_type_id' => $type->id,
                'name' => 'Elaboracion de expediente tecnico',
                'order' => 2,
            ]);
            TramiteSubphase::insert([
                [
                    'tramite_phase_id' => $expediente->id,
                    'name' => 'Planos, memorias e informes',
                    'order' => 1,
                ],
                [
                    'tramite_phase_id' => $expediente->id,
                    'name' => 'Plan de contingencia y matriz de riesgos',
                    'order' => 2,
                ],
            ]);

            $presentacion = TramitePhase::create([
                'tramite_type_id' => $type->id,
                'name' => 'Presentacion y seguimiento OSINERGMIN',
                'order' => 3,
            ]);
            TramiteSubphase::insert([
                [
                    'tramite_phase_id' => $presentacion->id,
                    'name' => 'Ingreso de expediente',
                    'order' => 1,
                ],
                [
                    'tramite_phase_id' => $presentacion->id,
                    'name' => 'Seguimiento de evaluacion',
                    'order' => 2,
                ],
            ]);

            $cierre = TramitePhase::create([
                'tramite_type_id' => $type->id,
                'name' => 'Subsanacion y cierre',
                'order' => 4,
            ]);
            TramiteSubphase::insert([
                [
                    'tramite_phase_id' => $cierre->id,
                    'name' => 'Levantamiento de observaciones',
                    'order' => 1,
                ],
                [
                    'tramite_phase_id' => $cierre->id,
                    'name' => 'Resultado final y archivo tecnico',
                    'order' => 2,
                ],
            ]);

            $tramite = Tramite::updateOrCreate(
                ['code' => 'ITF-2026-001'],
                [
                    'tramite_type_id' => $type->id,
                    'client_id' => $client?->id,
                    'client_name' => $client?->name,
                    'project_name' => 'ITF para estacion de servicio',
                    'property_name' => 'Establecimiento de combustibles liquidos',
                    'location' => 'El Tambo, Huancayo, Junin',
                    'responsible_id' => $master?->id,
                    'status' => Tramite::STATUS_IN_PROGRESS,
                    'registered_at' => now()->toDateString(),
                    'due_date' => now()->addDays(30)->toDateString(),
                    'notes' => 'Expediente demo PETROCOM para seguimiento de ITF y observaciones OSINERGMIN.',
                ]
            );

            Tramite::where('code', 'TR-001')->where('id', '!=', $tramite->id)->delete();

            $tramite->phases()->delete();
            $type->load('phases.subphases');
            foreach ($type->phases as $phase) {
                $phaseInstance = $tramite->phases()->create([
                    'tramite_phase_id' => $phase->id,
                    'name' => $phase->name,
                    'order' => $phase->order,
                    'status' => $phase->order === 1 ? Tramite::STATUS_COMPLETED : ($phase->order === 2 ? Tramite::STATUS_IN_PROGRESS : Tramite::STATUS_PENDING),
                ]);

                foreach ($phase->subphases as $sub) {
                    $tramiteSubInstance = $phaseInstance->subphases()->create([
                        'tramite_subphase_id' => $sub->id,
                        'name' => $sub->name,
                        'order' => $sub->order,
                        'status' => $phase->order === 1 ? Tramite::STATUS_COMPLETED : ($phase->order === 2 && $sub->order === 1 ? Tramite::STATUS_IN_PROGRESS : Tramite::STATUS_PENDING),
                    ]);

                    TramiteTask::create([
                        'tramite_id' => $tramite->id,
                        'tramite_phase_instance_id' => $phaseInstance->id,
                        'tramite_subphase_instance_id' => $tramiteSubInstance->id,
                        'title' => $sub->name,
                        'description' => 'Completar y validar: ' . strtolower($sub->name),
                        'assigned_to' => $operator?->id,
                        'created_by' => $master?->id,
                        'status' => $phase->order === 1 ? TramiteTask::STATUS_DONE : TramiteTask::STATUS_PENDING,
                        'progress' => $phase->order === 1 ? 100 : 0,
                        'due_date' => now()->addDays(7 + $phase->order)->toDateString(),
                    ]);
                }
            }
        });
    }
}
