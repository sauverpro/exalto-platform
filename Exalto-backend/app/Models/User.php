<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

#[Fillable(['full_name', 'email', 'password', 'role', 'phone_number'])]
#[Hidden(['remember_token'])]
class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public const ROLE_CLIENT = 'client';
    public const ROLE_ADMIN = 'admin';
    public const ROLE_SALES_MANAGER = 'sales_manager';

    public static function roles(): array
    {
        return [
            self::ROLE_CLIENT,
            self::ROLE_ADMIN,
            self::ROLE_SALES_MANAGER,
        ];
    }

    public function isClient(): bool
    {
        return $this->role === self::ROLE_CLIENT;
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isSalesManager(): bool
    {
        return $this->role === self::ROLE_SALES_MANAGER;
    }

    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles, true);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function getAuthPassword()
    {
        return $this->password;
    }
}
