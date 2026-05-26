<?php

namespace App\Support;

use App\Models\Tramite;
use App\Models\TramiteTask;
use Illuminate\Support\Collection;

class TramiteClientPresenter
{
    public function present(Tramite $tramite): array
    {
        $tramite->loadMissing([
            'type:id,name,code',
            'client:id,name,email',
            'responsible:id,name,email',
            'phases.subphases',
            'tasks:id,tramite_id,tramite_phase_instance_id,tramite_subphase_instance_id,title,status,progress,due_date,completed_at,observations,updated_at',
        ]);

        $currentPhase = $this->currentPhase($tramite);
        $currentSubphase = $this->currentSubphase($currentPhase);
        $progress = $this->progress($tramite);
        $lastUpdate = $this->lastUpdate($tramite);

        return [
            'id' => $tramite->id,
            'code' => $tramite->code,
            'type' => [
                'name' => $tramite->type?->name,
                'code' => $tramite->type?->code,
            ],
            'client_name' => $this->cleanValue($tramite->client_name) ?: $tramite->client?->name,
            'project_name' => $this->cleanValue($tramite->project_name),
            'property_name' => $this->cleanValue($tramite->property_name),
            'location' => $this->cleanValue($tramite->location),
            'entity' => 'Normativa aplicable',
            'responsible_name' => $tramite->responsible?->name,
            'status' => $tramite->status,
            'status_label' => $this->statusLabel($tramite->status),
            'progress' => $progress,
            'current_phase' => $currentPhase ? [
                'id' => $currentPhase->id,
                'name' => $currentPhase->name,
                'status' => $currentPhase->status,
                'status_label' => $this->statusLabel($currentPhase->status),
            ] : null,
            'current_subphase' => $currentSubphase ? [
                'id' => $currentSubphase->id,
                'name' => $currentSubphase->name,
                'status' => $currentSubphase->status,
                'status_label' => $this->statusLabel($currentSubphase->status),
            ] : null,
            'registered_at' => optional($tramite->registered_at)->toDateString(),
            'due_date' => optional($tramite->due_date)->toDateString(),
            'last_update_at' => optional($lastUpdate)->toISOString(),
            'next_action' => $this->nextAction($tramite, $currentPhase, $currentSubphase),
            'pending_documents' => $this->pendingDocuments($tramite->tasks),
            'observations' => $this->observations($tramite),
            'tasks_summary' => $this->tasksSummary($tramite->tasks),
            'phases' => $tramite->phases->map(fn ($phase) => [
                'id' => $phase->id,
                'name' => $phase->name,
                'order' => $phase->order,
                'status' => $phase->status,
                'status_label' => $this->statusLabel($phase->status),
                'progress' => $this->phaseProgress($phase),
                'started_at' => optional($phase->started_at)->toDateString(),
                'completed_at' => optional($phase->completed_at)->toDateString(),
                'subphases' => $phase->subphases->map(fn ($subphase) => [
                    'id' => $subphase->id,
                    'name' => $subphase->name,
                    'order' => $subphase->order,
                    'status' => $subphase->status,
                    'status_label' => $this->statusLabel($subphase->status),
                    'progress' => $this->statusProgress($subphase->status),
                    'started_at' => optional($subphase->started_at)->toDateString(),
                    'completed_at' => optional($subphase->completed_at)->toDateString(),
                ])->values(),
            ])->values(),
            'recent_activity' => $this->recentActivity($tramite),
        ];
    }

    private function progress(Tramite $tramite): int
    {
        if ($tramite->status === Tramite::STATUS_COMPLETED) {
            return 100;
        }

        if ($tramite->phases->isNotEmpty()) {
            return (int) round(($tramite->phases->where('status', Tramite::STATUS_COMPLETED)->count() / $tramite->phases->count()) * 100);
        }

        $subphases = $tramite->phases->flatMap(fn ($phase) => $phase->subphases);

        if ($subphases->isNotEmpty()) {
            return (int) round(($subphases->where('status', Tramite::STATUS_COMPLETED)->count() / $subphases->count()) * 100);
        }

        return $this->statusProgress($tramite->status);
    }

    private function cleanValue(?string $value): ?string
    {
        $value = trim((string) $value);

        if ($value === '' || in_array(strtolower($value), ['null', 'undefined', 'n/d'], true)) {
            return null;
        }

        return $value;
    }

    private function phaseProgress($phase): int
    {
        if ($phase->subphases->isNotEmpty()) {
            return (int) round($phase->subphases->avg(fn ($subphase) => $this->statusProgress($subphase->status)));
        }

        return $this->statusProgress($phase->status);
    }

    private function statusProgress(?string $status): int
    {
        return match ($status) {
            Tramite::STATUS_COMPLETED => 100,
            Tramite::STATUS_IN_PROGRESS => 50,
            Tramite::STATUS_OBSERVED => 50,
            default => 0,
        };
    }

    private function currentPhase(Tramite $tramite)
    {
        if ($tramite->phases->isEmpty()) {
            return null;
        }

        return $tramite->phases->firstWhere('status', '!=', Tramite::STATUS_COMPLETED)
            ?: $tramite->phases->last();
    }

    private function currentSubphase($phase)
    {
        if (!$phase || $phase->subphases->isEmpty()) {
            return null;
        }

        return $phase->subphases->firstWhere('status', '!=', Tramite::STATUS_COMPLETED)
            ?: $phase->subphases->last();
    }

    private function tasksSummary(Collection $tasks): array
    {
        return [
            'total' => $tasks->count(),
            'pending' => $tasks->where('status', TramiteTask::STATUS_PENDING)->count(),
            'in_progress' => $tasks->where('status', TramiteTask::STATUS_IN_PROGRESS)->count(),
            'blocked' => $tasks->where('status', TramiteTask::STATUS_BLOCKED)->count(),
            'done' => $tasks->where('status', TramiteTask::STATUS_DONE)->count(),
        ];
    }

    private function nextAction(Tramite $tramite, $currentPhase, $currentSubphase): string
    {
        if ($tramite->status === Tramite::STATUS_COMPLETED) {
            return 'El tramite figura como finalizado. Puedes comunicarte con el equipo para la entrega o archivo tecnico.';
        }

        if ($tramite->status === Tramite::STATUS_OBSERVED || $tramite->tasks->contains('status', TramiteTask::STATUS_BLOCKED)) {
            return 'Hay observaciones tecnicas en revision. El equipo actualizara el avance cuando se resuelvan.';
        }

        $nextTask = $tramite->tasks
            ->whereIn('status', [TramiteTask::STATUS_PENDING, TramiteTask::STATUS_IN_PROGRESS])
            ->sortBy('due_date')
            ->first();

        if ($nextTask) {
            return "Siguiente accion: {$nextTask->title}.";
        }

        if ($currentSubphase) {
            return "Etapa actual: {$currentSubphase->name}.";
        }

        if ($currentPhase) {
            return "Etapa actual: {$currentPhase->name}.";
        }

        return 'El equipo esta preparando la siguiente actualizacion del expediente.';
    }

    private function pendingDocuments(Collection $tasks): array
    {
        return $tasks
            ->whereIn('status', [TramiteTask::STATUS_PENDING, TramiteTask::STATUS_IN_PROGRESS, TramiteTask::STATUS_BLOCKED])
            ->pluck('title')
            ->filter()
            ->values()
            ->take(6)
            ->all();
    }

    private function observations(Tramite $tramite): array
    {
        $items = collect();

        if ($this->cleanValue($tramite->notes)) {
            $items->push($this->cleanValue($tramite->notes));
        }

        $tramite->tasks
            ->whereIn('status', [TramiteTask::STATUS_BLOCKED])
            ->each(function (TramiteTask $task) use ($items): void {
                $items->push($this->cleanValue($task->observations) ?: "Revisar {$task->title}.");
            });

        return $items->filter()->values()->take(5)->all();
    }

    private function recentActivity(Tramite $tramite): array
    {
        $items = collect();

        foreach ($tramite->phases as $phase) {
            $items->push([
                'type' => 'phase',
                'title' => $phase->name,
                'status' => $phase->status,
                'status_label' => $this->statusLabel($phase->status),
                'date' => $phase->updated_at,
            ]);

            foreach ($phase->subphases as $subphase) {
                $items->push([
                    'type' => 'subphase',
                    'title' => $subphase->name,
                    'status' => $subphase->status,
                    'status_label' => $this->statusLabel($subphase->status),
                    'date' => $subphase->updated_at,
                ]);
            }
        }

        foreach ($tramite->tasks as $task) {
            $items->push([
                'type' => 'task',
                'title' => $task->title,
                'status' => $task->status,
                'status_label' => $this->taskStatusLabel($task->status),
                'date' => $task->updated_at,
            ]);
        }

        return $items
            ->filter(fn ($item) => $item['date'])
            ->sortByDesc('date')
            ->take(6)
            ->map(fn ($item) => array_merge($item, [
                'date' => optional($item['date'])->toISOString(),
            ]))
            ->values()
            ->all();
    }

    private function lastUpdate(Tramite $tramite)
    {
        return collect([
            $tramite->updated_at,
            $tramite->phases->max('updated_at'),
            $tramite->phases->flatMap(fn ($phase) => $phase->subphases)->max('updated_at'),
            $tramite->tasks->max('updated_at'),
        ])->filter()->max();
    }

    private function statusLabel(?string $status): string
    {
        return match ($status) {
            Tramite::STATUS_IN_PROGRESS => 'En revision tecnica',
            Tramite::STATUS_OBSERVED => 'Observado',
            Tramite::STATUS_COMPLETED => 'Finalizado',
            default => 'Pendiente',
        };
    }

    private function taskStatusLabel(?string $status): string
    {
        return match ($status) {
            TramiteTask::STATUS_IN_PROGRESS => 'En elaboracion',
            TramiteTask::STATUS_BLOCKED => 'Observado',
            TramiteTask::STATUS_DONE => 'Subsanado',
            default => 'Pendiente',
        };
    }
}
