<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class VehiclePricingPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can change the locked selling price.
     */
    public function updatePrice(User $user, Vehicle $vehicle): Response
    {
        if ($user->role === 'owner') {
            return Response::allow();
        }

        return Response::deny('Forbidden: Vehicle selling prices are strictly owner-controlled and immutable by operational staff.');
    }

    /**
     * Determine whether the user can initiate an inter-branch transfer.
     */
    public function transferBranch(User $user, Vehicle $vehicle): Response
    {
        if (in_array($user->role, ['owner', 'branch_manager'])) {
            return Response::allow();
        }

        return Response::deny('Forbidden: Only Branch Managers and Executive Owners can initiate stock transfers.');
    }
}
