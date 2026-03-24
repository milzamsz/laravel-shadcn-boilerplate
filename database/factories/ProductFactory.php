<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'category' => $this->faker->randomElement(['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Toys', 'Beauty', 'Home']),
            'price' => $this->faker->randomFloat(2, 5, 999),
            'status' => $this->faker->randomElement(['active', 'inactive', 'draft']),
            'description' => $this->faker->sentence(),
        ];
    }
}
