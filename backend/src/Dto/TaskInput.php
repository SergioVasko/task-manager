<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;
use App\Enum\TaskVisibility;

class TaskInput
{
    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    public ?string $title = null;

    #[Assert\NotBlank]
    public ?string $description = null;

    #[Assert\Choice(choices: ['new', 'in_progress', 'completed'])]
    public ?string $status = 'new';

    #[Assert\NotNull]
    #[Assert\Choice(choices: [TaskVisibility::PUBLIC->value, TaskVisibility::PRIVATE->value])]
    public ?string $visibility = TaskVisibility::PRIVATE->value;

    #[Assert\Type('integer')]
    public ?int $category = null;
}
