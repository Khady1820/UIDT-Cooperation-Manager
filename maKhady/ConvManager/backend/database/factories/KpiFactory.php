<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class KpiFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(2),
            'valeur_cible' => 100,
            'valeur_atteinte' => $this->faker->numberBetween(0, 100),
            'convention_id' => \App\Models\Convention::factory(),
        ];
    }
}
