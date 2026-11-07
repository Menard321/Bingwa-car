<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        DB::statement('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

        // 1. Branches Table
        Schema::create('branches', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->string('code', 20)->unique();
            $table->string('name', 100);
            $table->string('city', 50)->default('Dar es Salaam');
            $table->text('location_description')->nullable();
            $table->decimal('gps_latitude', 10, 8)->nullable();
            $table->decimal('gps_longitude', 11, 8)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Users Table Updates (Multi-branch + RBAC)
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('branch_id')->nullable()->after('id');
            $table->enum('role', ['owner', 'branch_manager', 'sales_agent', 'customs_agent'])->default('sales_agent')->after('password');
            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('set null');
        });

        // 3. Vehicles Inventory Table
        Schema::create('vehicles', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('branch_id');
            $table->string('vin', 17)->unique();
            $table->string('make', 50)->index();
            $table->string('model', 50)->index();
            $table->integer('year_of_manufacture')->index();
            $table->integer('engine_capacity_cc');
            $table->string('fuel_type', 30); // Petrol, Diesel, Hybrid, Electric
            $table->string('transmission', 30); // Automatic, Manual, CVT
            $table->string('color', 40);
            $table->integer('mileage_km')->default(0);
            $table->string('import_type', 30)->default('LOCAL_STOCK'); // LOCAL_STOCK, JAPAN_IMPORT, UK_IMPORT
            $table->enum('status', ['AVAILABLE', 'RESERVED', 'IN_TRANSIT', 'SOLD'])->default('AVAILABLE')->index();
            
            // Strict Owner Price Lock Fields
            $table->decimal('selling_price_tzs', 15, 2)->index();
            $table->uuid('price_locked_by_user_id');
            $table->timestampTz('price_locked_at')->useCurrent();

            // PostgreSQL JSONB dynamic specs & media assets
            $table->jsonb('specifications')->default('{}');
            $table->jsonb('media_gallery')->default('[]');
            $table->text('model_3d_asset_url')->nullable();

            $table->timestamps();

            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('restrict');
            $table->foreign('price_locked_by_user_id')->references('id')->on('users')->onDelete('restrict');
        });

        // Index JSONB specifications for high-performance faceted searches
        DB::statement('CREATE INDEX idx_vehicles_specifications_gin ON vehicles USING gin (specifications);');

        // 4. Immutable Price Lock Audit Logs
        Schema::create('price_audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('vehicle_id');
            $table->uuid('changed_by_user_id');
            $table->decimal('previous_price_tzs', 15, 2);
            $table->decimal('new_price_tzs', 15, 2);
            $table->text('change_reason');
            $table->timestampTz('recorded_at')->useCurrent();

            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
            $table->foreign('changed_by_user_id')->references('id')->on('users')->onDelete('restrict');
        });

        // 5. TRA Customs & Foreign Import Logistics Pipeline
        Schema::create('foreign_imports', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('vehicle_id')->unique();
            $table->string('country_of_origin', 50); // Japan, UK, UAE
            $table->string('supplier_name', 100);
            $table->string('bl_number', 50)->unique();
            $table->string('container_number', 50)->nullable();
            $table->string('tracking_access_code', 32)->unique();
            $table->enum('customs_stage', [
                'ORDERED',
                'SHIPPED',
                'PORT_DAR',
                'TRA_ASSESSMENT',
                'TAX_PAID',
                'TBS_CLEARED',
                'YARD_DELIVERED'
            ])->default('ORDERED');
            $table->string('tra_assessment_number', 50)->nullable();
            $table->decimal('tra_duty_amount_tzs', 15, 2)->nullable();
            $table->date('estimated_arrival_date')->nullable();
            $table->date('actual_arrival_date')->nullable();
            $table->timestamps();

            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
        });

        // 6. Inter-Branch Stock Transfers
        Schema::create('inter_branch_transfers', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('vehicle_id');
            $table->uuid('source_branch_id');
            $table->uuid('destination_branch_id');
            $table->uuid('initiated_by_user_id');
            $table->uuid('authorized_by_user_id')->nullable();
            $table->enum('status', ['PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'])->default('PENDING');
            $table->text('transfer_notes')->nullable();
            $table->timestamps();

            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('restrict');
            $table->foreign('source_branch_id')->references('id')->on('branches')->onDelete('restrict');
            $table->foreign('destination_branch_id')->references('id')->on('branches')->onDelete('restrict');
            $table->foreign('initiated_by_user_id')->references('id')->on('users')->onDelete('restrict');
            $table->foreign('authorized_by_user_id')->references('id')->on('users')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inter_branch_transfers');
        Schema::dropIfExists('foreign_imports');
        Schema::dropIfExists('price_audit_logs');
        Schema::dropIfExists('vehicles');
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['branch_id']);
            $table->dropColumn(['branch_id', 'role']);
        });
        Schema::dropIfExists('branches');
    }
};

