<?php

/**
 * Laravel 11 / Illuminate & Symfony IDE Stubs for PHP Language Server
 * Resolves PHP0413 unknown class diagnostics when vendor/ is not installed locally.
 */

namespace Illuminate\Database\Migrations {
    abstract class Migration
    {
        public function up(): void {}
        public function down(): void {}
    }
}

namespace Illuminate\Database\Schema {
    class ForeignKeyDefinition
    {
        public function references(string|array $columns): self { return $this; }
        public function on(string $table): self { return $this; }
        public function onDelete(string $action): self { return $this; }
        public function onUpdate(string $action): self { return $this; }
        public function cascadeOnDelete(): self { return $this; }
        public function restrictOnDelete(): self { return $this; }
        public function nullOnDelete(): self { return $this; }
    }

    class ColumnDefinition
    {
        public function primary(): self { return $this; }
        public function unique(?string $indexName = null): self { return $this; }
        public function index(?string $indexName = null): self { return $this; }
        public function nullable(bool $value = true): self { return $this; }
        public function default(mixed $value): self { return $this; }
        public function after(string $column): self { return $this; }
        public function useCurrent(): self { return $this; }
        public function comment(string $comment): self { return $this; }
        public function constrained(?string $table = null, ?string $column = 'id'): ForeignKeyDefinition
        {
            return new ForeignKeyDefinition();
        }
    }

    class Blueprint
    {
        public function uuid(string $column = 'id'): ColumnDefinition { return new ColumnDefinition(); }
        public function foreignUuid(string $column): ColumnDefinition { return new ColumnDefinition(); }
        public function string(string $column, ?int $length = null): ColumnDefinition { return new ColumnDefinition(); }
        public function char(string $column, ?int $length = null): ColumnDefinition { return new ColumnDefinition(); }
        public function text(string $column): ColumnDefinition { return new ColumnDefinition(); }
        public function integer(string $column): ColumnDefinition { return new ColumnDefinition(); }
        public function unsignedInteger(string $column): ColumnDefinition { return new ColumnDefinition(); }
        public function smallInteger(string $column): ColumnDefinition { return new ColumnDefinition(); }
        public function unsignedSmallInteger(string $column): ColumnDefinition { return new ColumnDefinition(); }
        public function decimal(string $column, int $total = 8, int $places = 2): ColumnDefinition { return new ColumnDefinition(); }
        public function boolean(string $column): ColumnDefinition { return new ColumnDefinition(); }
        public function enum(string $column, array $allowed): ColumnDefinition { return new ColumnDefinition(); }
        public function jsonb(string $column): ColumnDefinition { return new ColumnDefinition(); }
        public function date(string $column): ColumnDefinition { return new ColumnDefinition(); }
        public function timestamp(string $column): ColumnDefinition { return new ColumnDefinition(); }
        public function timestampTz(string $column): ColumnDefinition { return new ColumnDefinition(); }
        public function timestamps(): void {}
        public function timestampsTz(): void {}
        public function softDeletesTz(string $column = 'deleted_at'): ColumnDefinition { return new ColumnDefinition(); }
        public function index(string|array $columns, ?string $name = null): self { return $this; }
        public function foreign(string|array $columns, ?string $name = null): ForeignKeyDefinition
        {
            return new ForeignKeyDefinition();
        }
        public function dropForeign(string|array $index): self { return $this; }
        public function dropColumn(string|array $columns): self { return $this; }
    }
}

namespace Illuminate\Support\Facades {
    use Closure;

    class Schema
    {
        public static function create(string $table, Closure $callback): void {}
        public static function table(string $table, Closure $callback): void {}
        public static function dropIfExists(string $table): void {}
    }

    class DB
    {
        public static function statement(string $query, array $bindings = []): bool { return true; }
        public static function raw(mixed $value): mixed { return $value; }
        public static function transaction(Closure $callback, int $attempts = 1): mixed { return $callback(); }
    }

    class Auth
    {
        public static function user(): ?\App\Models\User { return null; }
        public static function id(): int|string|null { return null; }
        public static function check(): bool { return true; }
    }

    class Gate
    {
        public static function authorize(string $ability, mixed $arguments = []): \Illuminate\Auth\Access\Response
        {
            return \Illuminate\Auth\Access\Response::allow();
        }
    }

    class Route
    {
        public static function prefix(string $prefix): self { return new self(); }
        public static function middleware(string|array $middleware): self { return new self(); }
        public function group(Closure $callback): self { return $this; }
        public static function get(string $uri, array|Closure $action): self { return new self(); }
        public static function post(string $uri, array|Closure $action): self { return new self(); }
        public static function patch(string $uri, array|Closure $action): self { return new self(); }
        public static function put(string $uri, array|Closure $action): self { return new self(); }
        public static function delete(string $uri, array|Closure $action): self { return new self(); }
    }

    class Http
    {
        public static function withToken(string $token, string $type = 'Bearer'): self { return new self(); }
        public static function withHeaders(array $headers): self { return new self(); }
        public function timeout(int $seconds): self { return $this; }
        public function post(string $url, array $data = []): mixed { return null; }
    }

    class Log
    {
        public static function info(string $message, array $context = []): void {}
        public static function warning(string $message, array $context = []): void {}
        public static function error(string $message, array $context = []): void {}
    }
}

namespace Illuminate\Http {
    class Request
    {
        public function validate(array $rules, array $messages = []): array { return []; }
        public function filled(string|array $key): bool { return true; }
        public function query(?string $key = null, mixed $default = null): mixed { return $default; }
        public function input(?string $key = null, mixed $default = null): mixed { return $default; }
        public function user(): ?\App\Models\User { return null; }
        public function ip(): ?string { return '127.0.0.1'; }
    }

    class JsonResponse
    {
        public function __construct(mixed $data = null, int $status = 200, array $headers = []) {}
    }
}

namespace Illuminate\Database\Eloquent {
    use Closure;

    interface Scope
    {
        public function apply(Builder $builder, Model $model): void;
    }

    class Builder
    {
        public function with(string|array $relations): self { return $this; }
        public function where(string|Closure|array $column, mixed $operator = null, mixed $value = null): self { return $this; }
        public function whereIn(string $column, array $values): self { return $this; }
        public function whereRaw(string $sql, array $bindings = []): self { return $this; }
        public function orderBy(string $column, string $direction = 'asc'): self { return $this; }
        public function paginate(int $perPage = 15): mixed { return []; }
        public function first(): mixed { return null; }
        public function firstOrFail(): mixed { return new Model(); }
        public function findOrFail(mixed $id): mixed { return new Model(); }
        public function lockForUpdate(): self { return $this; }
        public function get(): mixed { return []; }
    }

    abstract class Model
    {
        protected $keyType = 'string';
        public $incrementing = false;
        protected $fillable = [];
        protected $hidden = [];
        protected $casts = [];

        public string $id = '';
        public string $vin = '';
        public string $make = '';
        public string $model = '';
        public int $year_of_manufacture = 2021;
        public string $color = '';
        public int $mileage_km = 0;
        public string $status = 'AVAILABLE';
        public float|string $selling_price_tzs = 0.0;
        public ?string $branch_id = null;
        public ?string $source_branch_id = null;
        public ?string $destination_branch_id = null;
        public ?string $vehicle_id = null;
        public array $specifications = [];
        public mixed $branch = null;
        public mixed $vehicle = null;
        public string $customs_stage = 'ORDERED';
        public string $country_of_origin = 'Japan';
        public ?string $estimated_arrival_date = null;
        public ?string $actual_arrival_date = null;
        public mixed $updated_at = null;

        protected static function booted(): void {}
        public static function creating(Closure $callback): void {}
        public static function updating(Closure $callback): void {}
        public static function deleting(Closure $callback): void {}
        public static function addGlobalScope(Scope|Closure|string $scope, ?Closure $implementation = null): void {}
        public static function withoutGlobalScopes(?array $scopes = null): Builder { return new Builder(); }
        public static function with(string|array $relations): Builder { return new Builder(); }
        public static function where(string|Closure|array $column, mixed $operator = null, mixed $value = null): Builder { return new Builder(); }
        public static function findOrFail(mixed $id): static { return new static(); }
        public static function create(array $attributes = []): static { return new static(); }
        public function update(array $attributes = [], array $options = []): bool { return true; }
        public function save(array $options = []): bool { return true; }
        public function fresh(mixed $with = []): static { return $this; }
        public function load(string|array $relations): static { return $this; }
        public function getTable(): string { return ''; }
        public function isDirty(array|string|null $attributes = null): bool { return false; }
        public function getOriginal(?string $key = null, mixed $default = null): mixed { return $default; }
        public function belongsTo(string $related, ?string $foreignKey = null, ?string $ownerKey = null): Relations\BelongsTo
        {
            return new Relations\BelongsTo();
        }
        public function hasMany(string $related, ?string $foreignKey = null, ?string $localKey = null): Relations\HasMany
        {
            return new Relations\HasMany();
        }
        public function hasOne(string $related, ?string $foreignKey = null, ?string $localKey = null): Relations\HasOne
        {
            return new Relations\HasOne();
        }
    }
}

namespace Illuminate\Database\Eloquent\Concerns {
    trait HasUuids {}
}

namespace Illuminate\Database\Eloquent\Factories {
    trait HasFactory {}
}

namespace Illuminate\Database\Eloquent\Relations {
    class BelongsTo
    {
        public function orderBy(string $column, string $direction = 'asc'): self { return $this; }
    }
    class HasMany
    {
        public function orderBy(string $column, string $direction = 'asc'): self { return $this; }
    }
    class HasOne
    {
        public function orderBy(string $column, string $direction = 'asc'): self { return $this; }
    }
}

namespace Illuminate\Foundation\Auth {
    use Illuminate\Database\Eloquent\Model;

    class User extends Model
    {
        public string $role = 'sales_agent';
        public ?string $branch_id = null;
    }
}

namespace Illuminate\Notifications {
    trait Notifiable {}
}

namespace Illuminate\Auth\Access {
    trait HandlesAuthorization {}

    class Response
    {
        public static function allow(?string $message = null, mixed $code = null): self { return new self(); }
        public static function deny(string $message = 'This action is unauthorized.', mixed $code = null): self { return new self(); }
    }
}

namespace Illuminate\Bus {
    trait Queueable
    {
        public function onQueue(string $queue): self { return $this; }
    }
}

namespace Illuminate\Contracts\Queue {
    interface ShouldQueue {}
}

namespace Illuminate\Foundation\Bus {
    trait Dispatchable
    {
        public static function dispatch(mixed ...$arguments): mixed { return null; }
    }
}

namespace Illuminate\Queue {
    trait InteractsWithQueue {}
    trait SerializesModels {}
}

namespace Symfony\Component\HttpFoundation {
    class Response
    {
        public const HTTP_OK = 200;
        public const HTTP_CREATED = 201;
        public const HTTP_BAD_REQUEST = 400;
        public const HTTP_UNAUTHORIZED = 401;
        public const HTTP_FORBIDDEN = 403;
        public const HTTP_NOT_FOUND = 404;
        public const HTTP_CONFLICT = 409;
        public const HTTP_UNPROCESSABLE_ENTITY = 422;
    }
}

namespace {
    class BingwaCarbonStub
    {
        public function timezone(string $tz): self { return $this; }
        public function addHours(int $hours): self { return $this; }
        public function toIso8601String(): string { return date('c'); }
    }

    class BingwaResponseFactoryStub
    {
        public function json(mixed $data = [], int $status = 200, array $headers = []): \Illuminate\Http\JsonResponse
        {
            return new \Illuminate\Http\JsonResponse($data, $status, $headers);
        }
    }

    if (!function_exists('response')) {
        function response(): BingwaResponseFactoryStub
        {
            return new BingwaResponseFactoryStub();
        }
    }

    if (!function_exists('now')) {
        function now(): BingwaCarbonStub
        {
            return new BingwaCarbonStub();
        }
    }

    if (!function_exists('config')) {
        function config(?string $key = null, mixed $default = null): mixed
        {
            return $default;
        }
    }

    if (!function_exists('url')) {
        function url(string $path = ''): string
        {
            return $path;
        }
    }

    if (!function_exists('abort')) {
        function abort(int $code, string $message = ''): never
        {
            throw new \RuntimeException($message, $code);
        }
    }
}

