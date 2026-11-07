<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class BranchIsolationScope implements Scope
{
    /**
     * Apply the branch isolation scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $user = Auth::user();

        // Guest visitors and company Owners have complete access across all branches
        if (!$user || $user->role === 'owner') {
            return;
        }

        // Branch Managers and Sales Agents are restricted to their operational yard
        if ($user->branch_id) {
            $builder->where($model->getTable() . '.branch_id', $user->branch_id);
        }
    }
}
