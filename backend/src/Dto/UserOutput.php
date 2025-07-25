<?php

namespace App\Dto;

use App\Entity\User;

class UserOutput
{
    public string $id;
    public string $email;

    public function __construct(User $user)
    {
        $this->id = $user->getId();
        $this->email = $user->getEmail();
    }
}
