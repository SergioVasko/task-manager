<?php

namespace App\Enum;

enum TaskVisibility: string
{
    case PUBLIC = 'public';
    case PRIVATE = 'private';
}
