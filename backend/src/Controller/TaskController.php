<?php

namespace App\Controller;

use App\Dto\TaskOutput;
use App\Entity\Category;
use App\Entity\Task;
use App\Entity\User;
use App\Repository\TaskRepository;
use App\Enum\TaskVisibility;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Dto\TaskInput;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/tasks', name: 'api_tasks_')]
class TaskController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TaskRepository $taskRepository
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $user = $this->getUser();

        if ($user) {
            // Authenticated users see their tasks (public & private)
            $tasks = $this->taskRepository->findBy(['user' => $user], ['id' => 'ASC']);
        } else {
            // Guests see only public tasks
            $tasks = $this->taskRepository->findBy(['visibility' => TaskVisibility::PUBLIC], ['id' => 'ASC']);
        }

        $data = array_map(fn(Task $task) => new TaskOutput($task), $tasks);

        return $this->json($data, Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Task $task): JsonResponse
    {
        $user = $this->getUser();

        if ($task->getVisibility() === TaskVisibility::PRIVATE && $task->getUser() !== $user) {
            throw new AccessDeniedException('Access denied');
        }

        return $this->json(new TaskOutput($task), Response::HTTP_OK);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
        }

        $taskInput = $serializer->deserialize($request->getContent(), TaskInput::class, 'json');

        $errors = $validator->validate($taskInput);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $category = $this->em->getRepository(Category::class)->find($taskInput->category);
        if (!$category) {
            return $this->json(['error' => 'Category not found'], Response::HTTP_BAD_REQUEST);
        }

        $task = new Task();
        $task->setTitle($taskInput->title);
        $task->setDescription($taskInput->description);
        $task->setStatus($taskInput->status);
        $task->setVisibility(TaskVisibility::from($taskInput->visibility));
        $task->setUser($user);
        $task->setCategory($category);
        $task->setCreatedAt(new \DateTimeImmutable());

        $this->em->persist($task);
        $this->em->flush();

        return $this->json(['id' => $task->getId()], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(
        Request $request,
        Task $task,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user || $task->getUser() !== $user) {
            return $this->json(['error' => 'Access denied'], Response::HTTP_FORBIDDEN);
        }

        $taskInput = $serializer->deserialize($request->getContent(), TaskInput::class, 'json');

        $errors = $validator->validate($taskInput);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        if ($taskInput->title !== null) {
            $task->setTitle($taskInput->title);
        }
        if ($taskInput->description !== null) {
            $task->setDescription($taskInput->description);
        }
        if ($taskInput->status !== null) {
            $task->setStatus($taskInput->status);
        }
        if ($taskInput->visibility !== null) {
            $task->setVisibility(TaskVisibility::from($taskInput->visibility));
        }
        if ($taskInput->category !== null) {
            $category = $this->em->getRepository(Category::class)->find($taskInput->category);
            if (!$category) {
                return $this->json(['error' => 'Category not found'], Response::HTTP_BAD_REQUEST);
            }
            $task->setCategory($category);
        }

        $this->em->flush();

        return $this->json(['message' => 'Task updated']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Task $task): JsonResponse
    {
        $user = $this->getUser();
        if (!$user || $task->getUser() !== $user) {
            return $this->json(['error' => 'Access denied'], Response::HTTP_FORBIDDEN);
        }

        $this->em->remove($task);
        $this->em->flush();

        return $this->json(['message' => 'Task deleted']);
    }
}
