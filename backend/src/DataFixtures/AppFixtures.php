<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Task;
use App\Entity\User;
use App\Enum\TaskVisibility;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Create a new user
        $user = (new User())
            ->setEmail('user@example.com')
            ->setRoles(['ROLE_USER']);
        $user->setPassword(
            $this->passwordHasher->hashPassword(
                $user,
                'password'
            )
        );

        $manager->persist($user);
        $manager->flush();

        // Create a new category
        $category = (new Category())
            ->setName('Category 1');

        $manager->persist($category);
        $manager->flush();

        // Create new tasks
        $task = (new Task())
            ->setTitle('Task 1')
            ->setDescription('Task 1 description')
            ->setVisibility(TaskVisibility::PUBLIC)
            ->setStatus('new')
        ;
        $manager->persist($task);

        $task = (new Task())
            ->setTitle('Task 2')
            ->setCategory($category)
            ->setDescription('Task 2 description')
            ->setVisibility(TaskVisibility::PRIVATE)
            ->setStatus('new')
        ;
        $manager->persist($task);

        $task = (new Task())
            ->setTitle('Task 3')
            ->setCategory($category)
            ->setDescription('Task 3 description')
            ->setVisibility(TaskVisibility::PRIVATE)
            ->setUser($user)
            ->setStatus('assigned')
        ;
        $manager->persist($task);

        $manager->flush();
    }
}
