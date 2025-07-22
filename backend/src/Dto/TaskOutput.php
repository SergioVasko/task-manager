<?php

namespace App\Dto;

use App\Entity\Task;

class TaskOutput
{
    public int $id;
    public string $title;
    public ?string $description;
    public string $status;
    public string $visibility;
    public string $createdAt;

    public function __construct(Task $task)
    {
        $this->id = $task->getId();
        $this->title = $task->getTitle();
        $this->description = $task->getDescription();
        $this->status = $task->getStatus();
        $this->visibility = $task->getVisibility()->value;
        $this->createdAt = $task->getCreatedAt()->format(DATE_ATOM);
    }
}
