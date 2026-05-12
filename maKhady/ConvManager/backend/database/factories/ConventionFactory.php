<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ConventionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'type' => $this->faker->randomElement(['national', 'international', 'regional']),
            'description' => $this->faker->paragraph,
            'objectives' => $this->faker->paragraph,
            'partners' => $this->faker->company,
            'start_date' => now()->toDateString(),
            'end_date' => now()->addYear()->toDateString(),
            'status' => 'brouillon',
            'user_id' => \App\Models\User::factory(),
            'target' => 100,
            'actual_value' => 0,
            'completion_rate' => 0,
        ];
    }
}
